using CCMS.Core;
using SUREF.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SUREF.Services
{
    public class MappedFlightService : ServiceBase<App, MappedFlightView>
    {
        public override IRepository<MappedFlightView> Repository { get; set; }
        public override MappedFlightView Find(params object[] keys)
        {
            int id = (int)keys[0];
            return Query(a => a.Id == id).SingleOrDefault();
        }
    }
}
