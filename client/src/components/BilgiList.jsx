import React from "react";
import { AiFillDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import EditBilgi from "./EditBilgi";
import { useState } from "react";
const BilgiList = ({ tutorials, deleteBilgi, putBilgi }) => {
  // console.log(tutorials);
  const [updateBilgi, setUpdateBilgi] = useState("");
  return (
    <div className="container mt-4">
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#id</th>
            <th scope="col">Title</th>
            <th scope="col">Description</th>
            <th scope="col" className="text-center">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>
          {tutorials.map((a) => (
            <tr key={a.id}>
              <th>{a.id}</th>
              <td>{a.title}</td>
              <td>{a.description}</td>
              <td className="text-center">
                <AiFillDelete
                  type="button"
                  className="text-danger"
                  size={22}
                  onClick={() => deleteBilgi(a.id)}
                />
                <FaEdit
                  data-bs-toggle="modal"
                  data-bs-target="#editModal"
                  size={20}
                  className="text-warning"
                  cursor="pointer"
                  onClick={() =>
                    setUpdateBilgi({
                      id: a.id,
                      title: a.title,
                      description: a.description,
                    })
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal */}
      {/* tutorials dizisinde map le dolaşırken her bir elemana a diyoruz ve a sadece süslünün içinde erişilir. bu yüzden EditBilgi componentine a nın içeriğini, globalde bir state (updateBilgi) açarak, herkesin ulşamasını sağladık.tıklanan elemanın tüm bilgilerini ve tamircilerini EditBilgi comp. yolluyoruz */}
      <EditBilgi
        updateBilgi={updateBilgi}
        setUpdateBilgi={setUpdateBilgi}
        putBilgi={putBilgi}
      />
    </div>
  );
};
export default BilgiList;











