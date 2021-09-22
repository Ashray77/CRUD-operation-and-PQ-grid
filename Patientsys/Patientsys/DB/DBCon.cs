using Newtonsoft.Json;
using Patientsys.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace Patientsys.DB
{
    public class DBCon
    {
        private string connectionString = string.Empty;

        private SqlConnection sqlcon;

        public DBCon()
        {
            connectionString = ConfigurationManager.ConnectionStrings["myConnection"].ToString();

        }
        public void createConnection()
        {
            sqlcon = new SqlConnection(connectionString);

        }

        public void SaveData(PatientInfo data, out string message)
        {
            if (data.Id == 0)
            {
                try
                {
                    createConnection();
                    SqlCommand cmd = new SqlCommand("SP_INSERT_DATA", sqlcon);
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;

                    string jsonApp = JsonConvert.SerializeObject(data.Appointments);
                    string jsonTreat = JsonConvert.SerializeObject(data.Treatments);
                    cmd.Parameters.AddWithValue("@FullName", data.FullName);
                    cmd.Parameters.AddWithValue("@Age", data.Age);
                    cmd.Parameters.AddWithValue("@Phone_Num", data.PhoneNumber);
                    cmd.Parameters.AddWithValue("@Email", data.Email);
                    cmd.Parameters.AddWithValue("@Gender", data.SelectedGender);
                    cmd.Parameters.AddWithValue("@Pat_Add", data.Address);
                    cmd.Parameters.AddWithValue("@Treatments", jsonTreat);
                    cmd.Parameters.AddWithValue("@Appointments", jsonApp);
                    sqlcon.Open();
                    cmd.ExecuteNonQuery();
                    sqlcon.Close();

                    message = "Inserted Successfully";

                }
                catch (Exception ex)
                {
                    message = ex.Message;
                }
            }
            else
            {
                try
                {
                    createConnection();
                    SqlCommand cmd = new SqlCommand("SP_UPDATE_DATA", sqlcon);
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@PatId", data.Id);
                    string jsonApp = JsonConvert.SerializeObject(data.Appointments);
                    string jsonTreat = JsonConvert.SerializeObject(data.Treatments);
                    cmd.Parameters.AddWithValue("@FullName", data.FullName);
                    cmd.Parameters.AddWithValue("@Age", data.Age);
                    cmd.Parameters.AddWithValue("@Phone_Num", data.PhoneNumber);
                    cmd.Parameters.AddWithValue("@Email", data.Email);
                    cmd.Parameters.AddWithValue("@Gender", data.SelectedGender);
                    cmd.Parameters.AddWithValue("@Pat_Add", data.Address);
                    cmd.Parameters.AddWithValue("@Treatments", jsonTreat);
                    cmd.Parameters.AddWithValue("@Appointments", jsonApp);
                    sqlcon.Open();
                    cmd.ExecuteNonQuery();
                    sqlcon.Close();

                    message = "Inserted Successfully";

                }
                catch (Exception ex)
                {
                    message = ex.Message;
                }
            }
        }

        public List<PatientInfo> GetData()
        {
            List<PatientInfo> patientInfos = new List<PatientInfo>();
            createConnection();
            SqlCommand cmd = new SqlCommand("SP_SELECT_ALLDATA", sqlcon);
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            sqlcon.Open();
            SqlDataReader rdr = cmd.ExecuteReader();
            while (rdr.Read())
            {
                var patient = new PatientInfo();

                patient.Id = int.Parse(rdr["PatId"].ToString());
                patient.FullName = rdr["FULLNAME"].ToString();
                patient.Email = rdr["EMAIL"].ToString();
                patient.Age = rdr["AGE"].ToString();
                patient.PhoneNumber = rdr["PHONE_NUM"].ToString();
                patient.SelectedGender = rdr["GENDER"].ToString();
                patient.Address = rdr["Pat_Add"].ToString();

                patientInfos.Add(patient);
            }
            sqlcon.Close();
            return patientInfos;
        }

        public void Delete(int? id, out string message)
        {
            try
            {
                createConnection();
                SqlCommand cmd = new SqlCommand("SP_DELETE_DATA", sqlcon);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@PatId", id);

                sqlcon.Open();
                cmd.ExecuteNonQuery();
                sqlcon.Close();

                message = "success";

            }
            catch (Exception ex)
            {
                message = ex.Message;
            }
        }

        public PatientInfo SelectedData(int? Id)
        {
            PatientInfo patientInfo = new PatientInfo();
            List<TreatmentInfo> treatments = new List<TreatmentInfo>();
            List<AppointmentInfo> appointments = new List<AppointmentInfo>();
            List<MedicineInfo> medicines = new List<MedicineInfo>();
            createConnection();
            SqlCommand cmd = new SqlCommand("SP_EDIT_ALLDATA", sqlcon);
            cmd.CommandType = System.Data.CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@PatId", Id);
            sqlcon.Open();
            SqlDataReader rdr = cmd.ExecuteReader();
            if (rdr.HasRows)
            {
                while (rdr.Read())
                {
                    patientInfo.Id = int.Parse(rdr["Id"].ToString());
                    patientInfo.FullName = rdr["FullNAME"].ToString();
                    patientInfo.Age = rdr["AGE"].ToString();
                    patientInfo.PhoneNumber = rdr["PHONE_NUM"].ToString();
                    patientInfo.Email = rdr["EMAIL"].ToString();
                    patientInfo.SelectedGender = rdr["GENDER"].ToString();
                    patientInfo.Address = rdr["Pat_Add"].ToString();
                }
            }
            if (rdr.NextResult())
            {
                while (rdr.Read())
                {
                    appointments.Add(new AppointmentInfo
                    {
                        Id = int.Parse(rdr["Id"].ToString()),
                        AppCause = rdr["AppCause"].ToString(),
                        AppTreatment = rdr["AppTreatment"].ToString(),
                        AppDate = rdr["AppDate"].ToString(),
                        AppTime = rdr["AppTime"].ToString(),
                        AppRoomNum = rdr["AppRoomNum"].ToString()
                    });

                }
                patientInfo.Appointments = appointments;
            }
            if (rdr.NextResult())
            {
                while (rdr.Read())
                {
                    treatments.Add(new TreatmentInfo
                    {
                        Id = int.Parse(rdr["Id"].ToString()),
                        TreatmentName = rdr["TreatmentName"].ToString(),
                        TreatmentDate = rdr["TreatmentDate"].ToString(),
                        TreatmentTime = rdr["TreatmentTime"].ToString(),
                        DoctorName = rdr["DoctorName"].ToString()
                    });
                }

                //patientInfo.Treatments = treatments;

            }
            if (rdr.NextResult())
            {
                while (rdr.Read()) {
                    medicines.Add(new MedicineInfo()
                    {
                        Id = int.Parse(rdr["ID"].ToString()),
                        MedName = rdr["MedName"].ToString(),
                        MedCompany = rdr["MedCompany"].ToString(),
                        MedPrice = rdr["MedPrice"].ToString(),
                        MedExpDate = rdr["MedExpDate"].ToString(),
                        TreatmentId = int.Parse(rdr["TreatmentId"].ToString())
                    });
                }

            }
            sqlcon.Close();

            for (int i = 0; i < treatments.Count; i++)
            {
                var id = treatments[i].Id;
                List<MedicineInfo> medlist = new List<MedicineInfo>();

                for (int j = 0; j < medicines.Count; j++)
                {
                    if (id == medicines[j].TreatmentId)
                    {
                        medlist.Add(medicines[j]);
                    }
                }
                treatments[i].Medicines = medlist;
            }
            patientInfo.Treatments = treatments;
            return patientInfo;
        }

        public PQResult<PqFinalResult> GetAllData(PQModel requestData)
        {
            int totalRecords = 0;
            PqFinalResult resultData = new PqFinalResult();
            List<PatientInfo> list = new List<PatientInfo>();

            createConnection();
            SqlCommand cmd = new SqlCommand("SP_REMOTE_SELECT", sqlcon);
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.Add("@SKIP_COUNT", SqlDbType.Int).Value = (requestData.CurrentPage - 1) * requestData.RowPerPage;
            cmd.Parameters.Add("@ROW_COUNT", SqlDbType.Int).Value = requestData.RowPerPage;
            sqlcon.Open();
            SqlDataReader rdr = cmd.ExecuteReader();
            if (rdr.HasRows)
            {

                while (rdr.Read())
                {
                    var patient = new PatientInfo();

                    patient.Id = int.Parse(rdr["PatId"].ToString());
                    patient.FullName = rdr["FULLNAME"].ToString();
                    patient.Email = rdr["EMAIL"].ToString();
                    patient.Age = rdr["AGE"].ToString();
                    patient.PhoneNumber = rdr["PHONE_NUM"].ToString();
                    patient.SelectedGender = rdr["GENDER"].ToString();
                    patient.Address = rdr["Pat_Add"].ToString();

                    list.Add(patient);
                }
            }
            if (rdr.NextResult() && rdr.HasRows && rdr.Read())
            {
                totalRecords = rdr.GetInt32(0);
            }

            sqlcon.Close();

            resultData.AllData = list;

            return new PQResult<PqFinalResult>
            {
                Records = resultData,
                TotalCount = totalRecords
            };
        }

        public List<PatientInfo> SearchData(string searchname)
        {
            List<PatientInfo> patientInfos = new List<PatientInfo>();
            createConnection();
            SqlCommand cmd = new SqlCommand("SP_SEARCHNAME", sqlcon);
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.Parameters.AddWithValue("@FullName", searchname);
            sqlcon.Open();
            SqlDataReader rdr = cmd.ExecuteReader();
            while (rdr.Read())
            {
                var patient = new PatientInfo();

                patient.Id = int.Parse(rdr["Id"].ToString());
                patient.FullName = rdr["FULLNAME"].ToString();
                patient.Email = rdr["EMAIL"].ToString();
                patient.Age = rdr["AGE"].ToString();
                patient.PhoneNumber = rdr["PHONE_NUM"].ToString();
                patient.SelectedGender = rdr["GENDER"].ToString();
                patient.Address = rdr["Pat_Add"].ToString();

                patientInfos.Add(patient);
            }
            sqlcon.Close();
            return patientInfos;
        }
    }    
}