using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SUREF.Models
{
    public class MappedFlightViewModel
    {
        public decimal AnotherFlightID { get; set; }
        public decimal R4_RMS { get; set; }
        public decimal R5 { get; set; }
        public decimal R11 { get; set; }
        public string diagJson { get; set; }
    }
}