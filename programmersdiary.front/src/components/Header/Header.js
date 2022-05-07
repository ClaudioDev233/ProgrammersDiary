import React, { useContext, useState } from "react";
import { HeaderWrapper, Title, Save } from "./styles";
import { AiOutlineSave } from "react-icons/ai";
import { ManipulateContext } from "../../context/ManipulaItem/ManipulateItem";
import prettier from "prettier";
import Error from "../Error/Error";
import crud from "../../utils/crud";
import { pluginsLista } from "../../utils/utils";

const Header = ({ obj, codigo }) => {
  console.log(codigo);
  const { manipulableItem, addManipulableItem, allCards, addCards } =
    useContext(ManipulateContext);
  const [error, setErrors] = useState({});

  // caso o card seja novo vai atribuir um id, caso já existe vai atualiza-lo no banco
  async function atribuirIdCardOrUpdate(obj) {
    if (obj.id) {
      crud.atualizar(obj.id, obj);
    } else {
      obj.codigo = codigo;
      obj.id = await crud.inserir(obj);
    }
  }

  /*Alem de salvar, quando o card for alterado va devolver o codigo ja formatado para home*/
  function save() {
    try {
      if (manipulableItem.nome) {
        obj.novo = false;
        const clearCode = prettier.format(codigo, {
          parser: obj.linguagem.nome,
          plugins: pluginsLista,
          jsxSingleQuote: true,
          bracketSameLine: true,
        });
        atribuirIdCardOrUpdate(obj);
        addManipulableItem({ ...manipulableItem, codigo: clearCode });
        allCards[allCards.findIndex((card) => card.id === obj.id)] =
          manipulableItem;
        addCards(allCards);
        setErrors({ err: false });
      } else {
        setErrors({ err: "Crie um card antes de começar a digitar" });
      }
    } catch (err) {
      setErrors({ err: err });
    }
  }
  return (
    <>
      <HeaderWrapper>
        <Title>
          {error.err ? (
            <Error texto={error.err} />
          ) : obj.linguagem ? (
            obj.linguagem.labelLinguagem
          ) : null}
        </Title>
        <Save onClick={save}>
          <AiOutlineSave size="30px" />
        </Save>
      </HeaderWrapper>
    </>
  );
};

export default Header;
