using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Patientsys.Models
{
    public class AppointmentInfo
    {
        public int Id { get; set; }
        public string AppCause { get; set; }
        public string AppTreatment { get; set; }
        public string AppDate { get; set; }
        public string AppTime { get; set; }
        public string AppRoomNum { get; set; }
    }
}