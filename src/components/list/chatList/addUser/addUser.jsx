import './addUser.scss';
import Kitty from "../../../../utils/Kitty.jpg";

const AddUser = () => {
  return (
    <div className="addUser">
      <form>
       <input type="text" placeholder="Username" name="username" />
       <button>Search</button>
      </form>
      <div className= "user">
       <div className= "detail">
         <img src= {Kitty} alt= "" />
         <span>Jane Mattews</span>
       </div>
       <button>Add User</button>
      </div>
    </div>
  )
}

export default AddUser;