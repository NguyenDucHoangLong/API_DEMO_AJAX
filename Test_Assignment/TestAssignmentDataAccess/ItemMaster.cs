//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace TestAssignmentDataAccess
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public partial class ItemMaster
    {
        public int ItemMasterID_PK { get; set; }
        public Nullable<int> IMPack { get; set; }
        public string IMDescription { get; set; }

        [MaxLength]
        public string IMImageData { get; set; }
        public Nullable<bool> IMIsHazardousMaterial { get; set; }
        public Nullable<System.DateTime> MExpirationDate { get; set; }
        public Nullable<decimal> IMUnitPrice { get; set; }
        public Nullable<decimal> IMWidth { get; set; }
        public Nullable<decimal> IMLength { get; set; }
        public Nullable<decimal> IMHeight { get; set; }
        public Nullable<bool> IMIsPrePack { get; set; }
        public string IMPrePackStyle { get; set; }
        public string IMCostCenterCode { get; set; }
    }
}
