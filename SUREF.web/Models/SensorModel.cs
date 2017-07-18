using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SUREF.Models
{
    public class SensorModel
    {
        public decimal ID { get; set; }
        public string Name { get; set; }
        public string IP { get; set; }
        public Nullable<int> Port { get; set; }
        public string Description { get; set; }
    }
}