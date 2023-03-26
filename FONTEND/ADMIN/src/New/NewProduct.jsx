import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const NewProduct = () => {
  const location = useLocation();
  // điều kiện để thành trang edit
  const checkEdit = location.pathname === "/edit";

  const [productId, setProductId] = useState(
    checkEdit && location.state ? location.state._id : ""
  );
  const [productName, setProductName] = useState(
    checkEdit && location.state ? location.state.name : ""
  );
  const [category, setCategory] = useState(
    checkEdit && location.state ? location.state.category : ""
  );
  const [short_desc, setShort_desc] = useState(
    checkEdit && location.state ? location.state.short_desc : ""
  );
  const [long_desc, setLong_desc] = useState(
    checkEdit && location.state ? location.state.long_desc : ""
  );
  const [productPrice, setProductPrice] = useState(
    checkEdit && location.state ? location.state.price : ""
  );
  const [productCount, setProductCount] = useState(
    checkEdit && location.state ? location.state.count : ""
  );
  const [images, setImages] = useState([]);

  const [checkdata, setCheckdata] = useState(true);
  const [checkUpFile, setCheckUpFile] = useState(false);

  const onChangeImage = (e) => {
    setImages(e.target.files);
    setCheckUpFile(true);
  };

  // hàm sử lý sự kiện thêm sản phẩm
  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (
      productName &&
      category &&
      short_desc &&
      long_desc &&
      productPrice &&
      productCount &&
      images.length === 5
    ) {
      formData.append("productName", productName);
      formData.append("category", category);
      formData.append("short_desc", short_desc);
      formData.append("long_desc", long_desc);
      formData.append("productPrice", productPrice);
      formData.append("productCount", productCount);

      for (let key in images) {
        formData.append("image", images[key]);
      }

      let url = "http://localhost:5000/admin/add-product";

      const fetchData = async () => {
        try {
          const res = await fetch(url, {
            method: "POST",
            body: formData,
          });

          const data = await res.json();
          console.log(res);
          if (data.message === "Add New Product Success!!") {
            console.log("thêm sản phẩm thành công");
            Swal.fire({
              title: "Success!",
              text: "Do you want to go to the product list?",
              icon: "success",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, go to Product!",
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.replace("/products");
              }
            });

            setProductName("");
            setCategory("");
            setLong_desc("");
            setShort_desc("");
            setProductPrice("");
            setProductCount("");
            setImages([]);
          }
        } catch (err) {
          console.log(err);
        }
      };
      fetchData();

      setCheckdata(true);
    } else {
      setCheckdata(false);
      Swal.fire({
        title: "Error?",
        text: "Invalid product input!",
        icon: "error",
        cancelButtonColor: "#d33",
      });
    }
  };

  // khu vực code dùng để edit Product
  //nếu người dùng upload File mới và số lượng ảnh = 5 thì thông qua
  useEffect(() => {
    if (images.length === 5) {
      setCheckUpFile(false);
    }
  }, [images]);

  // hàm sử lý sự kiện sửa sản Phẩm
  const EditHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (
      productId &&
      productName &&
      category &&
      short_desc &&
      long_desc &&
      productPrice &&
      productCount &&
      !checkUpFile
    ) {
      formData.append("productId", productId);
      formData.append("productName", productName);
      formData.append("category", category);
      formData.append("short_desc", short_desc);
      formData.append("long_desc", long_desc);
      formData.append("productPrice", productPrice);
      formData.append("productCount", productCount);
      if (images.length > 0) {
        for (let key in images) {
          formData.append("image", images[key]);
        }
      }

      let url = "http://localhost:5000/admin/edit-product";

      const fetchData = async () => {
        try {
          const res = await fetch(url, {
            method: "POST",
            body: formData,
          });
          const data = await res.json();
          if (data.message === "Product updated successful!!") {
            let timerInterval;
            Swal.fire({
              title: "Product update is in progress!!",
              html: "I will close in <b></b> milliseconds.",
              timer: 2000,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading();
                const b = Swal.getHtmlContainer().querySelector("b");
                timerInterval = setInterval(() => {
                  b.textContent = Swal.getTimerLeft();
                }, 100);
              },
              willClose: () => {
                clearInterval(timerInterval);
              },
            }).then((result) => {
              /* Read more about handling dismissals below */
              if (result.dismiss === Swal.DismissReason.timer) {
                window.location.replace("/products");
              }
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Lỗi!! Không thể cập nhật lại sản phẩm",
              text: "Bạn vui lòng kiểm tra lại thoong tin sản phẩm hoặc liên hệ bảo trì web để được hỗ trợ!",
            });
          }
        } catch (err) {
          if (err)
            Swal.fire({
              icon: "error",
              title: "Lỗi!! Không thể cập nhật lại sản phẩm",
              text: "Bạn vui lòng kiểm tra lại đường truyền mạng hoặc liên hệ bảo trì web để được hỗ trợ!",
            });
        }
      };
      fetchData();

      setCheckdata(true);
    } else {
      setCheckdata(false);
      Swal.fire({
        title: "Error?",
        text: "Invalid product input!",
        icon: "error",
        cancelButtonColor: "#d33",
      });
    }
  };

  const nameErr = !checkdata && !productName;
  const categoryErr = !checkdata && !category;
  const long_descErr = !checkdata && !long_desc;
  const short_descErr = !checkdata && !short_desc;
  const priceErr = !checkdata && !productPrice;
  const countErr = !checkdata && !productCount;
  const imagesErr = checkEdit
    ? images.length > 0 && !checkdata && images.length !== 5
    : !checkdata && images.length !== 5;

  return (
    <div className="page-wrapper">
      <div className="page-breadcrumb">
        <div className="row">
          <form
            style={{ width: "50%", marginLeft: "40px" }}
            onSubmit={checkEdit ? EditHandler : submitHandler}
            encType="multipart/form-data"
          >
            <input
              type="hidden"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
            <div className="form-group">
              <label>
                Product Name
                {nameErr && (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 100,
                      color: "#eb4747",
                    }}
                  >
                    (Product Name cannot be left blank!)
                  </span>
                )}
              </label>
              <input
                type="text"
                value={productName}
                style={{
                  background: nameErr ? "#dd91815c" : "",
                }}
                className="form-control"
                placeholder="Enter Product Name"
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>
                Category
                {categoryErr && (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 100,
                      color: "#eb4747",
                    }}
                  >
                    (Category cannot be left blank!)
                  </span>
                )}
              </label>
              <input
                type="text"
                value={category}
                style={{
                  background: categoryErr ? "#dd91815c" : "",
                }}
                className="form-control"
                placeholder="Enter Category"
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>
                Short Description
                {short_descErr && (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 100,
                      color: "#eb4747",
                    }}
                  >
                    (Short Description cannot be left blank!)
                  </span>
                )}
              </label>
              <textarea
                style={{
                  background: short_descErr ? "#dd91815c" : "",
                }}
                value={short_desc}
                className="form-control"
                rows="3"
                placeholder="Enter Short Description"
                onChange={(e) => setShort_desc(e.target.value)}
              ></textarea>
            </div>
            <div className="form-group">
              <label>
                Long Description
                {long_descErr && (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 100,
                      color: "#eb4747",
                    }}
                  >
                    (Long Description cannot be left blank!)
                  </span>
                )}
              </label>
              <textarea
                style={{
                  background: long_descErr ? "#dd91815c" : "",
                }}
                value={long_desc}
                className="form-control"
                rows="4"
                placeholder="Enter Long Description"
                onChange={(e) => setLong_desc(e.target.value)}
              ></textarea>
            </div>
            <div className="form-group">
              <label>
                Product Price
                {priceErr && (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 100,
                      color: "#eb4747",
                    }}
                  >
                    (Product Price cannot be left blank!)
                  </span>
                )}
              </label>
              <input
                type="number"
                value={productPrice}
                style={{
                  background: priceErr ? "#dd91815c" : "",
                }}
                className="form-control"
                placeholder="Enter Product Price"
                onChange={(e) => setProductPrice(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>
                Product Count
                {countErr && (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 100,
                      color: "#eb4747",
                    }}
                  >
                    (Product Count cannot be left blank!)
                  </span>
                )}
              </label>
              <input
                type="number"
                value={productCount}
                style={{
                  background: countErr ? "#dd91815c" : "",
                }}
                className="form-control"
                placeholder="Enter Product Price"
                onChange={(e) => setProductCount(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="exampleFormControlFile1">
                Upload image (
                {checkEdit && !checkUpFile
                  ? "If you do not change the image file, do not select this input!"
                  : "5 images"}
                )
                {imagesErr && (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 100,
                      color: "#eb4747",
                    }}
                  >
                    (The number of images should be equal to 5!)
                  </span>
                )}
              </label>
              <input
                type="file"
                style={{
                  background: imagesErr ? "#dd91815c" : "",
                }}
                name="image"
                className="form-control-file"
                id="exampleFormControlFile1"
                multiple
                onChange={onChangeImage}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {checkEdit ? "Update" : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
