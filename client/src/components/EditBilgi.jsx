import React  from "react";
const EditBilgi = ({updateBilgi, setUpdateBilgi,putBilgi}) => {

 
  
// updateBilgi ile gelen bilgileri input ta value ile gösterdik, setUpdateBilgi ile de içini değiştirdik. buradaki div in id si ile, BilgiList teki buton (icon) un data-bs-target ismi aynı AiOutlineUserAdd, o buton tıklanınca bu div modal çalışır
  
 

  return (
    <div
      class="modal fade"
      id="editModal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fs-5" id="exampleModalLabel">
              Modal
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            {/* inputlar  */}
            <div className="mb-3">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                value={updateBilgi.title}
                onChange={(e) =>
                  setUpdateBilgi({ ...updateBilgi, title: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <label htmlFor="desc">Description</label>
              <input
                type="text"
                id="desc"
                className="form-control"
                value={updateBilgi.description}
                onChange={(e) =>
                  setUpdateBilgi({ ...updateBilgi, description: e.target.value })
                }
              />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={()=>putBilgi(updateBilgi)}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBilgi;
