import axios from 'axios'
import { useState } from 'react'

export const useResource = (baseUrl) => {
  const [data, setData] = useState(null)
  let token = null
  
  const setToken = newToken => {
    token = `bearer ${newToken}`
  }
  
  const getAll = async () => {
    const response = await axios.get(baseUrl)
    setData(response.data)
  }
  
  const create = async newObject => {
    const config = {
      headers: { Authorization: token },
    }
  
    const response = await axios.post(baseUrl, newObject, config)
    setData(oldData => oldData.concat(response.data))
  }
  
  const update = async (id, newObject) => {
    const response = await axios.put(`${baseUrl}/${id}`, newObject)
    setData(oldData => oldData.map(old => old.id === response.data.id ? response.data : old))
  }

  return [
    data,
    {
      setToken,
      getAll,
      create,
      update
    }
  ]
}




