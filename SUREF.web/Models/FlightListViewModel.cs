using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SUREF.Models
{
    public class FlightListViewModel
    {
        public decimal Id { get; set; }
        public decimal SensorID { get; set; }
        public DateTime DateOfFlight { get; set; }
        public string AircraftID { get; set; }
        public string CallSign { get; set; }
        public string TimeFrom { get; set; }
        public string TimeTo { get; set; }
        public DateTime CreateTime { get; set; }
        public DateTime ProcessRound { get; set; }
        public string Mode3ACode { get; set; }
        public string FilePath { get; set; }
        public string R2_5M { get; set; }
        public string R2_5R { get; set; }
        public int R3_5M { get; set; }
        public decimal R7_5M { get; set; }
        public decimal R7_5R { get; set; }
        public decimal R8_5M { get; set; }
        public decimal R9_5M { get; set; }
        public decimal R14_5M { get; set; }
        public decimal R14_5R { get; set; }
        public decimal R4 { get; set; }
        public decimal R5 { get; set; }
        public decimal R11 { get; set; }
        public int NT_5M { get; set; }
        public int? indicator { get; set; }
    }
}