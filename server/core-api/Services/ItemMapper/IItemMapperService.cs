﻿using System.Collections.Generic;
using System.Threading.Tasks;
using server.Model.Character;
using server.Util;
using server.Util.Enums;

namespace server.Services.ItemMapper
{
    public interface IItemMapperService
    {
        Task<List<InventoryModel>> MapInventory(RealmType realmType, List<InventoryModel> inventoryModels);
        Task<List<InventoryModel>> MapCustomInventory(RealmType realmType, List<InventoryModel> inventoryModels, int owner = 0);
    }
}
