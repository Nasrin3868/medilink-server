const check_the_file_is_in_pdf = async (pdf_name) => {
  const fileExtension = pdf_name.mimetype ? pdf_name.mimetype : null;
  return new Promise((resolve, reject) => {
    if (fileExtension !== "application/pdf") {
      console.log("its not a pdf");
      reject("File is not a PDF");
    } else {
      console.log("its a pdf");
      resolve(true);
    }
  });
};

const check_the_file_is_an_image = async (image_name) => {
  console.log(" check_the_file_is_an_image");
  const fileExtension = image_name.mimetype ? image_name.mimetype : null;
  return new Promise((resolve, reject) => {
    const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validImageTypes.includes(fileExtension)) {
      console.log("its not an image");
      reject("File is not an image");
    } else {
      console.log("its an image");
      resolve(true);
    }
  });
};

module.exports = {
  check_the_file_is_in_pdf,
  check_the_file_is_an_image,
};
