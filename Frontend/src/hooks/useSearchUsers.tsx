import axios from "axios";

const useSearchUsers = () => {
  const fetchUsers = async (keyword: string) => {
    try {
      const { data } = await axios.get(`/users/?search=${keyword}`);

      return data.data;
    } catch (error) {
      console.log(error);
    }
  };

  return { fetchUsers };
};

export default useSearchUsers;
