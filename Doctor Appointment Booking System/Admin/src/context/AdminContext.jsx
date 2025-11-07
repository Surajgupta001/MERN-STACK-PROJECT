import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {

    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '');
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [dashData, setDashData] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    
    const getAllDoctors = async () => {

        try {
            const { data } = await axios.post(
                backendUrl + '/api/admin/all-doctors',
                {},
                { headers: { atoken: aToken } }
            );
            if (data.success) {
                setDoctors(data.data);
                toast.success("Doctors fetched successfully");
                // console.log("Doctors fetched successfully:", data.data);
            } else {
                console.error("Failed to fetch doctors:", data.message);
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching doctors:", error);
            toast.error("An error occurred while fetching doctors");
        }
    };

    const changeAvailability = async (docId) => {
        
        try {
            const { data } = await axios.post(
                backendUrl + '/api/admin/change-availability',
                { docId },
                { headers: { atoken: aToken } }
            );
            if (data.success) {
                toast.success("Doctor availability changed successfully");
                getAllDoctors();
            } else {
                console.error("Failed to change doctor availability:", data.message);
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error changing doctor availability:", error);
            toast.error("An error occurred while changing doctor availability");
        }
    };

    const getAllAppointments = async () => {

        try {

            const { data } = await axios.get(
                backendUrl + '/api/admin/appointments',
                { headers: { atoken: aToken } }
            );
            
            if (data.success) {
                setAppointments(data.data);
                console.log("Appointments fetched successfully:", data.data);
                toast.success("Appointments fetched successfully");
            } else {
                console.error("Failed to fetch appointments:", data.message);
                toast.error(data.message);
            }
            
        } catch (error) {
            console.error("Error fetching appointments:", error);
            toast.error("An error occurred while fetching appointments");
        }
    };

    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(
                backendUrl + '/api/admin/cancel-appointment',
                { appointmentId },
                { headers: { atoken: aToken } }
            );

            if (data.success) {
                toast.success("Appointment cancelled successfully");
                getAllAppointments();
            } else {
                console.error("Failed to cancel appointment:", data.message);
                toast.error(data.message);
            }
            
        } catch (error) {
            console.error("Error cancelling appointment:", error);
            toast.error("An error occurred while cancelling the appointment");
        }
    };

    const getDashbData = async () => {

        try {

            const { data } = await axios.get(
                backendUrl + '/api/admin/dashboard',
                { headers: { atoken: aToken } }
            );

            if (data.success) {
                setDashData(data.dashData);
                console.log("Dashboard data fetched successfully:", data.dashData);
                toast.success("Dashboard data fetched successfully");
            } else {
                console.error("Failed to fetch dashboard data:", data.message);
                toast.error(data.message);
            }
            
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            toast.error("An error occurred while fetching dashboard data");
        }
    };

    const value = {
        aToken,
        setAToken,
        backendUrl,
        doctors,
        appointments,
        getAllDoctors,
        changeAvailability,
        getAllAppointments,
        cancelAppointment,
        getDashbData,
        dashData
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
};

export default AdminContextProvider;
