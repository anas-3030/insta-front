import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Loginimage from '../components/Loginimage';
import LoginLayout from '../components/LoginLayout';

const LoginPage = () => {

    return (
        <>
        <div className="container-fluid min-vh-100 d-flex align-items-center">
            <div className="row w-100">
                <div className="col-lg-4 d-none d-lg-block" style={{marginLeft:"182px", marginTop:"23px"}}>
                    <Loginimage />
                </div>
                <div className="col-lg-4 col-md-12">
                    <LoginLayout />
                </div>
            </div>
        </div><div className="row border-top py-2">
        <div className="col-lg-12 text-center fs-12" style={{ color: "#C7C7C7" }}>
          <p className="mb-0">
            About · Help · Press · API · Jobs · Privacy · Terms · Locations · Language
          </p>
          <p className="mb-0">© 2024 INSTAGRAM FROM META</p>
        </div>
      </div>
  
         </>
    );
};
export default LoginPage;
