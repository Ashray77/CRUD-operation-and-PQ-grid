using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Patientsys.Models
{
    public class TreatmentInfo
    {
        public int Id { get; set; }
        public string TreatmentName { get; set; }
        public string TreatmentDate { get; set; }
        public string TreatmentTime { get; set; }
        public string DoctorName { get; set; }
        public virtual List<MedicineInfo> Medicines { get; set; }
    }
}