using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TestAssignmentDataAccess;

namespace Test_Assignment
{
    public class ItemMasterController : ApiController
    {
        /// <summary>
        /// Get Item Master By Id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ItemMaster GetItemMasterById(int id)
        {
            using (TestAssignmentEntities entities = new TestAssignmentEntities())
            {
                return entities.ItemMasters.FirstOrDefault(i => i.ItemMasterID_PK == id);
            }
        }

        /// <summary>
        /// Get ItemMaster by ID
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetItemMasterLikeId/{id}/")]
        public IEnumerable<ItemMaster> GetItemMasterLikeId(int id)
        {
            using (TestAssignmentEntities entities = new TestAssignmentEntities())
            {
                return entities.ItemMasters.Where(i => i.ItemMasterID_PK.ToString().Contains(id.ToString())).ToList();
            }
        }

        /// <summary>
        /// Get all ItemMaster
        /// </summary>
        /// <returns></returns>
        public IEnumerable<ItemMaster> GetAllItemMasters()
        {
            using (TestAssignmentEntities entities = new TestAssignmentEntities())
            {
                return entities.ItemMasters.ToList();
            }
        }

        /// <summary>
        /// Save ItemMaster
        /// </summary>
        /// <param name="values"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("SaveItemMaster")]
        public string SaveItemMaster(ItemMaster objItemMaster)
        {
            try
            {
                string result = string.Empty;
                using (TestAssignmentEntities entities = new TestAssignmentEntities())
                {
                    int itemMasterID_PK = objItemMaster.ItemMasterID_PK;
                    ItemMaster itemMaster = entities.ItemMasters.Find(itemMasterID_PK);
                    if (itemMaster != null)
                    {
                        itemMaster.IMPack = objItemMaster.IMPack;
                        itemMaster.IMDescription = objItemMaster.IMDescription;
                        itemMaster.IMImageData = objItemMaster.IMImageData;
                        itemMaster.IMIsHazardousMaterial = objItemMaster.IMIsHazardousMaterial;
                        itemMaster.MExpirationDate = objItemMaster.MExpirationDate;
                        itemMaster.IMUnitPrice = objItemMaster.IMUnitPrice;
                        itemMaster.IMWidth = objItemMaster.IMWidth;
                        itemMaster.IMLength = objItemMaster.IMLength;
                        itemMaster.IMHeight = objItemMaster.IMHeight;
                        itemMaster.IMIsPrePack = objItemMaster.IMIsPrePack;

                        itemMaster.IMPrePackStyle = objItemMaster.IMPrePackStyle;
                        itemMaster.IMCostCenterCode = objItemMaster.IMCostCenterCode;
                        result = "Update ItemMaster Successfully";
                    }
                    else
                    {
                        ItemMaster newItemMaster = new ItemMaster();
                        newItemMaster.ItemMasterID_PK = objItemMaster.ItemMasterID_PK;
                        newItemMaster.IMPack = objItemMaster.IMPack;
                        newItemMaster.IMDescription = objItemMaster.IMDescription;
                        newItemMaster.IMImageData = objItemMaster.IMImageData;
                        newItemMaster.IMIsHazardousMaterial = objItemMaster.IMIsHazardousMaterial;
                        newItemMaster.MExpirationDate = objItemMaster.MExpirationDate;
                        newItemMaster.IMUnitPrice = objItemMaster.IMUnitPrice;
                        newItemMaster.IMWidth = objItemMaster.IMWidth;
                        newItemMaster.IMHeight = objItemMaster.IMHeight;
                        newItemMaster.IMIsPrePack = objItemMaster.IMIsPrePack;
                        newItemMaster.IMPrePackStyle = objItemMaster.IMPrePackStyle;
                        newItemMaster.IMCostCenterCode = objItemMaster.IMCostCenterCode;

                        entities.ItemMasters.Add(newItemMaster);
                        result = "Intert new ItemMaster Successfully";
                    }
                    entities.SaveChanges();
                    return result;
                }

            }
            catch (Exception)
            {
                return "Error when create Master Item. Please help to check input!";
            }
        }
    }
}
