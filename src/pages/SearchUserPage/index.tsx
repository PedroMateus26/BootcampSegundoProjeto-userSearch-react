import React, { useEffect, useRef, useState } from "react";
import ActionButton from "../../core/components/ActionButton";
import ImageLoader from "../../core/components/UserLoader/ImageLoader";
import InfoLoader from "../../core/components/UserLoader/InfoLoader";
import { UserData } from "../../core/types/UserData";
import { makeRequest } from "../../core/utils/request";
import "./styles.css";

const SearchUserPage = () => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [userData, setUserData] = useState<UserData>();
  const [status, setStatus] = useState<number>();
  const idElement = document.getElementById("show-hidden");
  const idElementError = document.getElementById("error");
  const idElementLoader = document.getElementById("loader");

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleOnClick = () => {
    setClicked(true);
    setIsLoading(true);
    makeRequest({ url: `${name}` })
      .then((response) => [
        setUserData(response.data),
        setStatus(response.status),
      ])
      .catch(() => setStatus(404));
    //.then(response=>[setUserData(response.data),setStatus(response.status)]).catch(response=>console.log(response));
    //.then(response=>setUserData(response.data))
    //.then(response=>console.log(response.status))
  };

  const searchFunction = () => {
    if (idElement && idElementError && idElementLoader) {
      if (clicked) {
        idElementError.style.display = "none";
        idElement.style.display = "none";
        idElementLoader.style.display = "flex";
        if (status === 200) {
          idElementLoader.style.display = "none";
          idElement.style.display = "flex";
          setStatus(0);
          setClicked(false);
        } else if (status === 404) {
          idElementLoader.style.display = "none";
          idElementError.style.display = "flex";
          setStatus(0);
          setClicked(false);
        }
      }
    }
  };

  useEffect(() => {
    searchFunction();
  },[clicked,status]);

  return (
    <>
      
      <div className="search-container">
        <h1 className="search-title">Encontre um perfil Github</h1>
        <input
          placeholder="Nome do Usuário"
          type="text"
          value={name}
          className="search-input-text"
          onChange={handleOnChange}
        />

        <ActionButton title="Encontrar" onClick={handleOnClick} />
      </div>

      <div className="loader-container" id="loader">
        <ImageLoader />
        <InfoLoader />
      </div>

      <div className="user-container" id="show-hidden">
        <div></div>
        <div>
          <img src={userData?.avatar_url} className="user-img" />
          <a href={userData?.html_url}>
            <ActionButton title="Ver Perfil" />
          </a>
        </div>
        <div className="user-folows-info">
          <div className="user-follows-fields">
            <h2 className="user-follows-text">{`Repositórios públicos: ${userData?.public_repos}`}</h2>
          </div>
          <div className="user-follows-fields">
            <h2 className="user-follows-text">{`Seguidores: ${userData?.followers}`}</h2>
          </div>
          <div className="user-follows-fields">
            <h2 className="user-follows-text">{`Seguindo: ${userData?.following}`}</h2>
          </div>
          <div className="user-info">
            <h1 className="user-info-title">Informações</h1>
            <div className="user-info-filds">
              <h2 className="user-info-fields-text">{`Empresa: ${userData?.company}`}</h2>
            </div>
            <div className="user-info-filds">
              <h2 className="user-info-fields-text">
                {" "}
                {`Website/Blog: ${userData?.blog}`}
              </h2>
            </div>
            <div className="user-info-filds">
              <h2 className="user-info-fields-text">{`Localidade: ${userData?.location}`}</h2>
            </div>
            <div className="user-info-filds">
              <h2 className="user-info-fields-text">{`Membro desde: ${userData?.created_at}`}</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="error-container" id="error">
        <h1>Não há nenhum usuário com esse nome</h1>
      </div>
    </>
  );
};

export default SearchUserPage;
