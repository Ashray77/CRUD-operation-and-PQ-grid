using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Patientsys.Models
{
    public class PatientInfo
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Age { get; set; }
        public string PhoneNumber { get; set; }
        public string SelectedGender { get; set; }
        public string Address { get; set; }
        public virtual List<AppointmentInfo> Appointments { get; set; }
        public virtual List<TreatmentInfo> Treatments { get; set; }

    }
}