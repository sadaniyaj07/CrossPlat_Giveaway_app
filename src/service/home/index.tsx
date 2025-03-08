import axios, { AxiosProgressEvent } from "axios";
import { request } from "../../service/common/request";
import { HttpMethods } from "../../utils/constants/constants";
import { AuthUrl, Url, instance } from "../../utils/urls/url";
import { useContext } from "react";
import { CurrentErrorContext } from "../../context/error_message_context";

export const getSearchInfo = async (
  setCallApi: Function,
  reqObj: any,
  setData: Function,
  ErrorContext: any
) => {
  setCallApi(true);
  let url = `${Url}/playlist/search?`;
  if (reqObj?.artistId) {
    url = url + `artistId=${reqObj?.artistId}`;
  }
  if (reqObj?.search) {
    url = url + `search=${reqObj?.search}`;
  }
  request(url, HttpMethods.Get, null, ErrorContext, false)
    .then((res: any = {}) => {
      if (reqObj?.artistId) {
        setData(res?.data?.data);
      } else if (
        reqObj?.search == "" ||
        reqObj?.search == null ||
        reqObj?.search == undefined
      ) {
        let obj = {
          artists: [],
          albums: [],
          albumDetails: [],
        };
        setData(obj);
      } else {
        setData(res?.data?.data);
      }
      setCallApi(false);
    })
    .catch((error) => {
      console.log(
        "Error in Get Curated Song List:-------- 2 getSearchInfo",
        error
      );
      setCallApi(false);
    });
};

export const addProducts = async (
  reqObj: Object,
  setCallApi: Function,
  setData: Function,
  ErrorContext: any
) => {
  setCallApi(true);
  const url = `${Url}/User/addproducts`;
  // console.log("url", url);
  // console.log("reqObj", reqObj);
  request(url, HttpMethods.Post, reqObj, ErrorContext)
    .then((res: any = {}) => {
      setData(res?.data);
      setCallApi(false);
      return res;
    })
    .catch((error) => {
      setCallApi(false);
    });
};

export const uploadImage = async (uri: string, name: string, type: string) => {
  console.log("--1--");

  const data = new FormData();
  console.log("--2--");

  data.append("file", { uri, name, type });
  console.log("--3--");

  const ec2 = await upload(data);
  console.log("--4--");

  const ec2Image = ec2.Files[0];
  console.log("--5--");

  const s3Req = { FilePath: ec2Image.File, tokenId: ec2Image.tokenId };
  console.log("--6--");
  console.log("🚀 ~ uploadImage ~ s3Req:", s3Req);

  // const s3Image = await uploadimage(s3Req, ErrorContext);
  // console.log("--7--", s3Image);

  return s3Req;
};

export const upload = async (
  data: FormData,
  url?: string,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
) => {
  try {
    const response = await instance({
      method: HttpMethods.Post,
      url: url ?? `${Url}/upload/image`,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: data,
      onUploadProgress,
    });
    // console.log("response here=====", response, data);

    return { ...response.data };
  } catch (error) {
    console.log("err==", error);

    throw error;
  }
};

export const uploadimage = async (
  reqObj: Object,
  setCallApi: Function,
  setData: Function,
  ErrorContext: any
) => {
  const url = `${Url}/User/ImageUrl`;
  setCallApi(true);
  // console.log("🚀 ~ .then ~ res:", url);
  try {
    let res = await request(url, HttpMethods.Post, reqObj, null, ErrorContext);
    // console.log("🚀 ~ .then ~ res:", res);
    setCallApi(false);
    return res;
  } catch (error) {
    console.log(error);
    setCallApi(false);
  }
};

export const removesong = async (
  setCallApi: Function,
  reqObj: any,
  setData: Function,
  ErrorContext: any
) => {
  setCallApi(true);
  // console.log(reqObj);
  const url = `${Url}/playlist/removesongsfromplaylist`;
  // console.log(url);
  request(url, HttpMethods.Put, reqObj, ErrorContext, false)
    .then((res: any = {}) => {
      // console.log("res?.data?.data", res);
      // console.log("res?.data?.data", res?.data);
      // console.log("res?.data?.data", res?.data?.data);
      setData(res?.data);
      setCallApi(false);
    })
    .catch((error) => {
      console.log("Error in removesong", error);
      // setData(error?.data);
      // setOriginalData(error?.data);
      setCallApi(false);
    });
};

export const getMyProductData = async (
  setCallApi: Function,
  setData: Function,
  ErrorContext: any
) => {
  setCallApi(true);
  const url = `${Url}/User/getUserproducts`;
  // console.log("url", url);
  try {
    let res = await request(url, HttpMethods.Get, null, ErrorContext, false);
    setData(res?.data?.data);
    setCallApi(false);
    return res?.data?.data;
  } catch (error) {
    console.log("getMyPlaylistData", error);
    setCallApi(false);
  }
};

export const gettype = async (
  setCallApi: Function,
  setData: Function,
  ErrorContext: any
) => {
  setCallApi(true);
  const url = `${Url}/User/gettype`;
  // console.log("url", url);
  try {
    let res = await request(url, HttpMethods.Get, null, ErrorContext, false);
    setData(res?.data?.data);
    setCallApi(false);
    return res?.data?.data;
  } catch (error) {
    console.log("gettype", error);
    setCallApi(false);
  }
};

export const getAllProductData = async (
  setCallApi: Function,
  reqObj: any,
  setData: Function,
  ErrorContext: any
) => {
  setCallApi(true);
  let url = `${Url}/User/getAllproducts?pagination=yes&page=${reqObj?.page}&limit=10&q=${reqObj?.q}&Type=${reqObj?.type}`;
  // let url = `${Url}`;
  // console.log("url", url);
  // console.log(reqObj);
  try {
    let res = await request(url, HttpMethods.Get, reqObj, ErrorContext, false);
    setData(res?.data?.data);
    setCallApi(false);
    return res?.data?.data;
  } catch (error) {
    console.log("getMyPlaylistData", error);
    setCallApi(false);
  }
};

export const getAllusers = async (
  setCallApi: Function,
  reqObj: any,
  setData: Function,
  ErrorContext: any
) => {
  setCallApi(true);
  let url = `${Url}/User/getAllusers?pagination=yes&page=${reqObj?.page}&limit=10&q=${reqObj?.q}`;
  // let url = `${Url}`;
  console.log("url", url);
  console.log(reqObj);
  try {
    let res = await request(url, HttpMethods.Get, reqObj, ErrorContext, false);
    setData(res?.data?.data);
    setCallApi(false);
    return res?.data?.data;
  } catch (error) {
    console.log("getMyPlaylistData", error);
    setCallApi(false);
  }
};

export const getSearchListing = async (
  setCallApi: Function,
  reqObj: any,
  setData: Function,
  data: any,
  setTotalPages: Function,
  ErrorContext: any
) => {
  setCallApi(true);
  const url = `${Url}/playlist/search/${reqObj?.search}`;
  request(url, HttpMethods.Post, null, ErrorContext, false)
    .then((res: any = {}) => {
      if (reqObj.page == 1) {
        setTotalPages(res?.data);
        setData(res?.data);
      } else {
        var item = data.concat(res?.data);
        setData(item);
      }
      setCallApi(false);
    })
    .catch((error) => {
      console.log("Error in Get Users:-------- getSearchListing", error);
      setCallApi(false);
    });
};

export const onEndReached = (
  currentPage: number,
  totalPages: number,
  setObj: Function
) => {
  if (currentPage < totalPages) {
    setObj((prevState: any) => ({
      ...prevState,
      page: currentPage + 1,
    }));
  }
};
