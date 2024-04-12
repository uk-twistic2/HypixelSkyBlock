package net.swofty.types.generic.minion.extension.extensions;

import lombok.NonNull;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.format.TextDecoration;
import net.minestom.server.entity.Player;
import net.minestom.server.event.inventory.InventoryClickEvent;
import net.minestom.server.event.inventory.InventoryPreClickEvent;
import net.minestom.server.inventory.click.ClickType;
import net.minestom.server.item.ItemStack;
import net.minestom.server.item.Material;
import net.swofty.types.generic.gui.inventory.ItemStackCreator;
import net.swofty.types.generic.gui.inventory.inventories.GUIMinion;
import net.swofty.types.generic.gui.inventory.item.GUIClickableItem;
import net.swofty.types.generic.item.ItemType;
import net.swofty.types.generic.item.SkyBlockItem;
import net.swofty.types.generic.item.impl.MinionFuelItem;
import net.swofty.types.generic.item.updater.NonPlayerItemUpdater;
import net.swofty.types.generic.minion.IslandMinionData;
import net.swofty.types.generic.minion.extension.MinionExtension;
import net.swofty.types.generic.user.SkyBlockPlayer;
import net.swofty.types.generic.utility.StringUtility;
import org.jetbrains.annotations.Nullable;

import java.util.stream.Stream;

public class MinionFuelExtension extends MinionExtension {
    private long insertionTime = 0;
    private int count = 0;

    public MinionFuelExtension(@Nullable ItemType itemType, @Nullable Object data) {
        super(itemType, data);

        if (data != null) {
            insertionTime = (long) data;
        }
    }

    @Override
    public @NonNull GUIClickableItem getDisplayItem(IslandMinionData.IslandMinion minion, int slot) {
        boolean shouldDisplayItem = true;

        if (getItemTypePassedIn() == null) {
            shouldDisplayItem = false;
        } else {
            long timeFuelLasts = ((MinionFuelItem) new SkyBlockItem(getItemTypePassedIn()).getGenericInstance()).getFuelLastTimeInMS();
            if (System.currentTimeMillis() - insertionTime > timeFuelLasts) {
                count -= 1;
                if(count <= 0) {
                    shouldDisplayItem = false;
                    setItemTypePassedIn(null);
                }
                insertionTime = System.currentTimeMillis();
                minion.getExtensionData().setData(slot, MinionFuelExtension.this);
                minion.getMinionEntity().updateMinionDisplay(minion);
            }
        }

        if (!shouldDisplayItem)
            return new GUIClickableItem(slot) {
                @Override
                public void run(InventoryPreClickEvent e, SkyBlockPlayer player) {
                    SkyBlockItem fuelItem = new SkyBlockItem(e.getCursorItem());

                    if (fuelItem.getGenericInstance() == null) {
                        player.sendMessage("§cThis item is not a valid Minion Fuel item.");
                        e.setCancelled(true);
                        return;
                    }

                    if (fuelItem.getGenericInstance() instanceof MinionFuelItem) {
                        int added = MinionFuelExtension.this.AddFuel(minion, slot, fuelItem);
                        if(added >= fuelItem.getAmount())
                            e.setCursorItem(ItemStack.AIR);
                        else{
                            fuelItem.setAmount(fuelItem.getAmount() - added);
                            e.setCursorItem(fuelItem.getItemStack());
                        }
                    } else {
                        player.sendMessage("§cThis item is not a valid Minion Fuel item.");
                        e.setCancelled(true);
                    }
                }

                @Override
                public void runPost(InventoryClickEvent e, SkyBlockPlayer player) {
                    new GUIMinion(minion).open(player);
                }

                @Override
                public boolean canPickup() {
                    return true;
                }

                @Override
                public ItemStack.Builder getItem(SkyBlockPlayer player) {
                    return ItemStackCreator.getStack("§aFuel", Material.ORANGE_STAINED_GLASS_PANE, 1,
                            "§7Increase the speed of your",
                            "§7minion by adding minion fuel",
                            "§7items here.",
                            " ",
                            "§cNote: §7You can't take fuel",
                            "§7back out after you place it",
                            "§7here.");
                }
            };

        return new GUIClickableItem(slot) {

            @Override
            public void run(InventoryPreClickEvent e, SkyBlockPlayer player) {
                if(e.getClickType() == ClickType.RIGHT_CLICK) {
                    setItemTypePassedIn(null);
                    minion.getExtensionData().setData(slot, MinionFuelExtension.this);
                    new GUIMinion(minion).open(player);
                }else{
                    SkyBlockItem fuelItem = new SkyBlockItem(e.getCursorItem());
                    if (! (fuelItem.getGenericInstance() instanceof MinionFuelItem)){
                        player.sendMessage("§cYou can only put fuel in this slot.");
                    }else{
                        if(getItemTypePassedIn() != fuelItem.getAttributeHandler().getItemTypeAsType()){
                            player.sendMessage("§aReplaced your old fuel!");
                        }
                        int added = MinionFuelExtension.this.AddFuel(minion, slot, fuelItem);
                        if(added < fuelItem.getAmount()){
                            fuelItem.setAmount(fuelItem.getAmount() - added);
                        }
                        e.getInventory().setCursorItem(player,fuelItem.getItemStack());
                    }
                }
            }

            @Override
            public void runPost(InventoryClickEvent e, SkyBlockPlayer player) {
                new GUIMinion(minion).open(player);
            }

            @Override
            public ItemStack.Builder getItem(SkyBlockPlayer player) {
                long timeFuelLasts = ((MinionFuelItem) new SkyBlockItem(getItemTypePassedIn()).getGenericInstance()).getFuelLastTimeInMS();

                ItemStack.Builder item = new NonPlayerItemUpdater(new SkyBlockItem(getItemTypePassedIn(), count)).getUpdatedItem();
                item = item.displayName(Component.text("§aMinion Fuel Slot").decoration(TextDecoration.ITALIC, false))
                        .lore(Stream.of(
                                "§7This Minion fuel increases the",
                                "§7speed of your minion.",
                                " ",
                                "§7Current Fuel: " + getItemTypePassedIn().rarity.getColor() + getItemTypePassedIn().getDisplayName(),
                                "§7Time Left: §e" + StringUtility.formatTimeLeft(timeFuelLasts * count - (System.currentTimeMillis() - insertionTime)),
                                "§7Modifier: §a" + ((MinionFuelItem) new SkyBlockItem(getItemTypePassedIn()).getGenericInstance()).getMinionFuelPercentage() + "%",
                                " ",
                                "§cRight Click to destroy this fuel."
                        ).map(line -> Component.text(line).decoration(TextDecoration.ITALIC, false)).toList());

                return item;
            }
        };
    }

    public int AddFuel(IslandMinionData.IslandMinion minion, int slot, SkyBlockItem fuelItem){
        if (fuelItem.getGenericInstance() instanceof MinionFuelItem) {
            insertionTime = System.currentTimeMillis();
            int add = fuelItem.getAmount();
            if(getItemTypePassedIn() != fuelItem.getAttributeHandler().getItemTypeAsType()) {
                count = add;
            }else{
                add = count + add > 64 ? 64 - count : add;
                count += add;
            }
            setItemTypePassedIn(fuelItem.getAttributeHandler().getItemTypeAsType());
            minion.getExtensionData().setData(slot, MinionFuelExtension.this);
            minion.getMinionEntity().updateMinionDisplay(minion);
            return add;
        }
        return 0;
    }

    @Override
    public String toString() {
        if (getItemTypePassedIn() == null) {
            return "null";
        }
        return getItemTypePassedIn().toString() + ":" + insertionTime + ":" + count;
    }

    @Override
    public void fromString(String string) {
        if (string.equals("null")) {
            setItemTypePassedIn(null);
            return;
        }
        String[] split = string.split(":");
        setItemTypePassedIn(ItemType.valueOf(split[0]));
        insertionTime = Long.parseLong(split[1]);
        if(split.length > 2)
            count = Integer.parseInt(split[2]);
    }
}
