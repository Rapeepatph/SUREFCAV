﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class SUREFEntities : DbContext
    {
        public SUREFEntities()
            : base("name=SUREFEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<Flight> Flights { get; set; }
        public virtual DbSet<FlightView> FlightViews { get; set; }
        public virtual DbSet<SensorView> SensorViews { get; set; }
        public virtual DbSet<DMappedFlightView> DMappedFlightViews { get; set; }
        public virtual DbSet<MappedFlightView> MappedFlightViews { get; set; }
    }
}
