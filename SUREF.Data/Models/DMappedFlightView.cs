//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace SUREF.Data.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class DMappedFlightView
    {
        public decimal Id { get; set; }
        public decimal FlightID { get; set; }
        public decimal AnotherFlightID { get; set; }
        public System.DateTime TimeFrom { get; set; }
        public System.DateTime TimeTo { get; set; }
        public decimal R4_H_ZIGMA_E_SQ { get; set; }
        public int R4_H_N { get; set; }
        public decimal R4_H_RMS { get; set; }
        public string R4_H_Diagnose { get; set; }
        public decimal R11_V_ZIGMA_E_SQ { get; set; }
        public int R11_V_N { get; set; }
        public decimal R11_V_RMS { get; set; }
        public string R11_V_Diagnose { get; set; }
        public int R10_VI_NI200 { get; set; }
        public int R10_VI_NI300 { get; set; }
        public int R10_VI_NV { get; set; }
        public decimal R10_VI_R200 { get; set; }
        public decimal R10_VI_R300 { get; set; }
        public string R10_VI_Diagnose { get; set; }
        public decimal R5_H_CE_R_5N { get; set; }
        public decimal R5_H_CE_R_3N { get; set; }
        public System.DateTime CreateTime { get; set; }
        public System.DateTime ProcessRound { get; set; }
    }
}
