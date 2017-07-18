using CCMS.Core;
using SUREF.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SUREF.Services
{
    public class SensorService : ServiceBase<App, SensorView>
    {
        public override IRepository<SensorView> Repository { get; set; }
        public override SensorView Find(params object[] keys)
        {
            int id = (int)keys[0];
            return Query(a => a.ID == id).SingleOrDefault();
        }
    }
}
