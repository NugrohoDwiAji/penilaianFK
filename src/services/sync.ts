import axios from "axios";

export const mahasiswaSyn = (callback: (status?: boolean) => void) => {
  try {
    axios.post("/api/mahasiswa").then(() => callback(true)); // mahasiswaSyn
  } catch (error) {
    callback(false);
    console.log(error);
  }
};
