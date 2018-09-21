using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using TestAssignmentDataAccess;

namespace Test_Assignment
{
    public class ItemMasterInventoryIDController : ApiController
    {
        /// <summary>
        /// Get all ItemMasterInventoryID
        /// </summary>
        /// <returns></returns>
        public IEnumerable<ItemMasterInventoryID> Get()
        {
            using (TestAssignmentEntities entities = new TestAssignmentEntities())
            {
                return entities.ItemMasterInventoryIDs.ToList();
            }
        }

        /// <summary>
        /// Get all ItemMasterInventoryID by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public IEnumerable<Inventory> Get(int id)
        {
            using (TestAssignmentEntities entities = new TestAssignmentEntities())
            {
                List<Inventory> listInventory = new List<Inventory>();

                var queryInventory = from itemMasterInventory in entities.ItemMasterInventoryIDs.AsQueryable()
                                     join itemMaster in entities.ItemMasters on itemMasterInventory.IMIItemMasterID_FK equals itemMaster.ItemMasterID_PK
                                     join location in entities.Locations on itemMasterInventory.ItemLocationID_FK equals location.ItemLocationID_PK
                                     where itemMasterInventory.IMIItemMasterID_FK == id
                                     select new Inventory
                                     {
                                         Location = location.Location1,
                                         OnHand = itemMasterInventory.IMIQtyOnHand ?? 0,
                                         OnHandPcs = itemMasterInventory.IMIQtyOnHand * itemMaster.IMPack ?? 0,
                                         Allocated = itemMasterInventory.IMIQtyAllocated ?? 0,
                                         AllocationPcs = itemMasterInventory.IMIQtyAllocated * itemMaster.IMPack ?? 0,
                                         Available = (itemMasterInventory.IMIQtyOnHand - itemMasterInventory.IMIQtyAllocated) ?? 0,
                                         AvailablePcs = ((itemMasterInventory.IMIQtyOnHand - itemMasterInventory.IMIQtyAllocated) * itemMaster.IMPack) ?? 0
                                     };
                return queryInventory.ToList<Inventory>();
            }
        }
    }
}