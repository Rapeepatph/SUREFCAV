using CCMS.Core;
using SUREFCAV.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SUREF.Services
{
    public class MappedFlightCavService : ServiceBase<App, MappedFlight>
    {
        public override IRepository<MappedFlight> Repository { get; set; }
        public override MappedFlight Find(params object[] keys)
        {
            int id = (int)keys[0];
            return Query(a => a.Id == id).SingleOrDefault();
        }
    }
}
