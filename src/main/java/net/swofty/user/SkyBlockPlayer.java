package net.swofty.user;

import lombok.Getter;
import lombok.Setter;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.TextComponent;
import net.minestom.server.MinecraftServer;
import net.minestom.server.entity.Player;
import net.minestom.server.instance.block.Block;
import net.minestom.server.network.packet.server.play.UpdateHealthPacket;
import net.minestom.server.network.player.PlayerConnection;
import net.minestom.server.timer.TaskSchedule;
import net.swofty.SkyBlock;
import net.swofty.data.DataHandler;
import net.swofty.data.datapoints.DatapointRank;
import net.swofty.gui.inventory.SkyBlockInventoryGUI;
import net.swofty.item.SkyBlockItem;
import net.swofty.region.mining.MineableBlock;
import net.swofty.region.SkyBlockRegion;
import net.swofty.user.categories.Rank;
import net.swofty.user.statistics.ItemStatistic;
import net.swofty.user.statistics.PlayerStatistics;
import net.swofty.user.statistics.StatisticDisplayReplacement;
import org.jetbrains.annotations.NotNull;

import java.util.UUID;
import java.util.function.Supplier;

public class SkyBlockPlayer extends Player {

    @Getter
    private float mana = 100;
    public float health = 100;
    public long joined = 0;
    @Setter
    @Getter
    public boolean bypassBuild = false;

    @Getter
    private StatisticDisplayReplacement manaDisplayReplacement = null;
    @Getter
    private StatisticDisplayReplacement defenseDisplayReplacement = null;
    @Getter
    private PlayerAbilityHandler abilityHandler = new PlayerAbilityHandler();

    public SkyBlockPlayer(@NotNull UUID uuid, @NotNull String username, @NotNull PlayerConnection playerConnection) {
        super(uuid, username, playerConnection);

        if (SkyBlock.offlineUUIDs.contains(uuid)) {
            this.setUsernameField("cracked" + username);
            SkyBlock.offlineUUIDs.remove(uuid);
        }

        joined = System.currentTimeMillis();
    }

    public DataHandler getDataHandler() {
        return DataHandler.getUser(this.uuid);
    }

    public PlayerStatistics getStatistics() {
        return new PlayerStatistics(this);
    }

    public void setDisplayReplacement(StatisticDisplayReplacement replacement, StatisticDisplayReplacement.DisplayType type) {
        // Determine which replacement to update based on type
        StatisticDisplayReplacement currentReplacement =
                (type == StatisticDisplayReplacement.DisplayType.MANA) ? this.manaDisplayReplacement :
                        this.defenseDisplayReplacement;

        // Check if the replacement needs to be updated
        if (currentReplacement == null || currentReplacement.getTicksToLast() > replacement.getTicksToLast()) {
            // Update the appropriate replacement based on type
            if (type == StatisticDisplayReplacement.DisplayType.MANA) {
                this.manaDisplayReplacement = replacement;
            } else if (type == StatisticDisplayReplacement.DisplayType.DEFENSE) {
                this.defenseDisplayReplacement = replacement;
            }

            int hashCode = replacement.hashCode();

            MinecraftServer.getSchedulerManager().scheduleTask(() -> {
                StatisticDisplayReplacement scheduledReplacement =
                        (type == StatisticDisplayReplacement.DisplayType.MANA) ? this.manaDisplayReplacement :
                                this.defenseDisplayReplacement;
                if (hashCode == scheduledReplacement.hashCode()) {
                    if (type == StatisticDisplayReplacement.DisplayType.MANA) {
                        this.manaDisplayReplacement = null;
                    } else if (type == StatisticDisplayReplacement.DisplayType.DEFENSE) {
                        this.defenseDisplayReplacement = null;
                    }
                }
            }, TaskSchedule.tick(replacement.getTicksToLast()), TaskSchedule.stop());
        }
    }

    public SkyBlockRegion getRegion() {
        return SkyBlockRegion.getRegionOfPosition(this.getPosition());
    }

    public void setMana(float mana) {
        this.mana = mana;
    }

    public float getMaxMana() {
        float maxMana = 100;

        PlayerStatistics statistics = this.getStatistics();
        maxMana += statistics.allArmorStatistics().get(ItemStatistic.INTELLIGENCE);
        maxMana += statistics.mainHandStatistics().get(ItemStatistic.INTELLIGENCE);

        return maxMana;
    }

    public int getMiningSpeed() {
        return this.getStatistics().mainHandStatistics().get(ItemStatistic.MINING_SPEED) +
                this.getStatistics().allArmorStatistics().get(ItemStatistic.MINING_SPEED);
    }

    public double getTimeToMine(SkyBlockItem item, Block b) {
        MineableBlock block = MineableBlock.get(b);
        if (block == null) return -1;
        if (!item.getAttributeHandler().isMiningTool()) return -1;
        if (getRegion() == null) return -1;

        if (block.getMiningPowerRequirement() > item.getAttributeHandler().getBreakingPower()) return -1;
        if (block.getStrength() > 0) {
            double time = (block.getStrength() * 30) / (Math.max(getMiningSpeed(), 1));
            double softcap = ((double) 20 / 3) * block.getStrength();
            if (time < 1)
                return 1;

            return Math.min(time, softcap);
        }

        return 0;
    }

    public float getDefence() {
        float defence = 0;

        PlayerStatistics statistics = this.getStatistics();
        defence += statistics.allArmorStatistics().get(ItemStatistic.DEFENSE);
        defence += statistics.mainHandStatistics().get(ItemStatistic.DEFENSE);

        return defence;
    }

    public void debug(Object message) {
        debug(Component.text(String.valueOf(message)));
    }

    public void debug(TextComponent message) {
        debug(message, () -> true);
    }

    public void debug(Object message, Supplier<Boolean> condition) {
        debug(Component.text(String.valueOf(message)), condition);
    }

    public void debug(TextComponent message, Supplier<Boolean> condition) {
        if (getDataHandler().get(DataHandler.Data.RANK, DatapointRank.class).getValue().isEqualOrHigherThan(Rank.ADMIN)) {
            if (!condition.get()) return;
            sendMessage(Component.text("§9[HELPER DEBUG] §f").append(message));
        }
    }

    public void setHearts(float hearts) {
        this.health = hearts;
        this.sendPacket(new UpdateHealthPacket((hearts / getMaxHealth()) * 20, 20, 20));
    }

    @Override
    public float getMaxHealth() {
        float maxHealth = 100;

        PlayerStatistics statistics = this.getStatistics();
        maxHealth += statistics.allArmorStatistics().get(ItemStatistic.HEALTH);
        maxHealth += statistics.mainHandStatistics().get(ItemStatistic.HEALTH);

        return maxHealth;
    }

    @Override
    public float getHealth() {
        return this.health;
    }

    @Override
    public void setHealth(float health) {
        if ((System.currentTimeMillis() - joined) < 3000)
            return;
        this.health = health;
        this.sendPacket(new UpdateHealthPacket((health / getMaxHealth()) * 20, 20, 20));
    }

    @Override
    public void sendMessage(@NotNull String message) {
        super.sendMessage(message.replace("&", "§"));
    }

    @Override
    public void closeInventory() {
        super.closeInventory();
        if (SkyBlockInventoryGUI.GUI_MAP.containsKey(this.getUuid())) {
            SkyBlockInventoryGUI gui = SkyBlockInventoryGUI.GUI_MAP.get(this.getUuid());

            if (gui == null) return;

            gui.onClose(null, SkyBlockInventoryGUI.CloseReason.SERVER_EXITED);
            SkyBlockInventoryGUI.GUI_MAP.remove(this.getUuid());
        }
    }
}
