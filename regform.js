import React, { useState } from 'react';

const Regform = () => {
  const [errors,setErrors]=useState({});
    const [formData,setFormData]=useState({
        name:'',
        email:'',
        password:'',
        age:'',
    });

    const handleChange = (e) =>{
      const {name,value}=e.target;
      setFormData({
        ...formData,[name]:value,
      })
    }

    const handleSubmit = (e) =>{
      e.preventDefault();
      const validateErrors={};
      if(!formData.name.trim()){
        validateErrors.name="Name is required"
      }

      if(!formData.email.trim()){
        validateErrors.email="Email is required"
      }
      else if(!/\S+@\S+\.\S+/.test(formData.email)){
        validateErrors.email="Email is not valid";
      }

      if(!formData.password.trim()){
        validateErrors.password="Password is required"
      }
      else if(formData.password.length<6){
        validateErrors.password="Password should be atleast 6 characters";
      }
      if(!formData.age.trim()){
        validateErrors.age="Age is required"
      }
      setErrors(validateErrors)
      if(Object.keys(validateErrors).length===0){
        alert("Form Submitted");
        <h3>Name: {formData.name}</h3>
        setFormData({
          name:'',
          email:'',
          password:'',
          age:'',
        });
      }
    }
  return (

    <div>
      <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder='Enter your name' value={formData.name} onChange={handleChange}/>
                {errors.name && <span>{errors.name}</span>}

                <input type="email" name="email" value={formData.email} placeholder='Enter your email' onChange={handleChange}/>
                {errors.email && <span>{errors.email}</span>}

                <input type="password" name="password" placeholder='Enter your password' value={formData.password} onChange={handleChange}/>
                {errors.password && <span>{errors.password}</span>}

                <input type="number" name="age" placeholder='Enter your age' value={formData.age} onChange={handleChange}/>
                {errors.age && <span>{errors.age}</span>}

                <input type="submit" value="SUBMIT"/>
            </form>
            <div id="sub">
                <h2>Submitted Details:</h2>
                <p>Name: {formData.name}</p>
                <p>Email: {formData.email}</p>
                <p>Age: {formData.age}</p>
            </div>
    </div>

  )
}

export default Regform;
