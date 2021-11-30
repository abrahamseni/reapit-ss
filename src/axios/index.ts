import axios from "axios";
import { BASE_HEADERS } from "../constants/api";

const axiosInstances = axios.create({
  baseURL: "https://platform.reapit.cloud/",
  headers: {
    ...BASE_HEADERS,
  },
});

export default axiosInstances;
