const APICall = async (url, req = "GET", data = {}) => {
    url = process.env.REACT_APP_API_URL + url;
  
    const params = {
      method: req,
      headers: {
        "Content-Type": "application/json",
      },
    };
  
    if (req === "POST" || req === "PUT") {
      params.body = JSON.stringify(data);
    }
  
    const response = await fetch(url, params);
    return response;
  };
  
  export default APICall;
  