import React, { useEffect, useState } from "react";
import axios from "axios";
import BilgiList from "../components/BilgiList";
import AddBilgi from "../components/AddBilgi";
const Home = () => {
  const [tutorials, setTutorials] = useState([]);

  // const url = "https://tutorial-api.fullstack.clarusway.com/tutorials/";
  const url = "http://127.0.0.1:8000/todo/";

  //!GET (READ)
  const getBilgiler = async () => {
    const res = await axios.get(url);
    console.log(res.data); // {error:false, result:[]}

    setTutorials(res.data.result);
  };

  useEffect(() => {
    getBilgiler();
  }, []);

  //!POST (create database e veri gönderme)

  const postBilgi = async (yeniVeri) => {
    await axios.post(url, yeniVeri);

    getBilgiler();
  };

  //!DELETE (database den silme)

  const deleteBilgi = async (id) => {
    // console.log(id);

    await axios.delete(`${url}${id}/`);

    getBilgiler();
  };

  //!put update işlemi

  const putBilgi = async (yeniVeri) => {
    await axios.put(`${url}${yeniVeri.id}/`, yeniVeri);

    getBilgiler();
  };

  return (
    <>
      <AddBilgi postBilgi={postBilgi} />

      <BilgiList
        tutorials={tutorials}
        deleteBilgi={deleteBilgi}
        putBilgi={putBilgi}
      />
    </>
  );
};

export default Home;
