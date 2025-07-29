import User from '../models/User.js'

const createUser = async ()=>{
    return await User.create(data)
}

// const deleteUser  = async(id)=>{
//     return await User.deleteOne({_id: id})
// }

export default { createUser } 