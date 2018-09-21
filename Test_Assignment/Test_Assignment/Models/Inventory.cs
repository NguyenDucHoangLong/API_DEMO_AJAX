using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Test_Assignment
{
    public class Inventory
    {
        public string Location { get; set; }
        public decimal OnHand { get; set; }
        public decimal OnHandPcs { get; set; }

        public decimal Allocated { get; set; }

        public decimal AllocationPcs { get; set; }

        public decimal Available { get; set; }

        public decimal AvailablePcs { get; set; }
    }
}