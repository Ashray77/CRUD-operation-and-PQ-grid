using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Patientsys.Models
{
    public class MedicineInfo
    {
        public int Id { get; set; }
        public string MedName { get; set; }
        public string MedCompany { get; set; }
        public string MedPrice { get; set; }
        public string MedExpDate { get; set; }
        public int TreatmentId { get; set; }
    }
}