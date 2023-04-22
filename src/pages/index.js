import { useEffect, useState } from "react"

export default function Home() {
  let [ idUsuario, setIdUsuario ] = useState(-1)
  let [ nome, setNome ] = useState("")
  let [ email, setEmail ] = useState("")
  let [ usuarios, setUsuarios ] = useState([])
  let [ busca, setBusca ] = useState("")

  let usuariosFiltrados = []
  if (busca.length > 0) {
    usuariosFiltrados = usuarios.filter(usuario => usuario.nome.includes(busca))
    console.log("Usuarios filtrados:", usuariosFiltrados)
  }

  useEffect(() => {
    carregarUsuarios()
  }, [])

  function carregarUsuarios() {
    fetch("https://63442914dcae733e8fd8e3e5.mockapi.io/usuarios")
        .then(function(response) {
            if (!response.ok) {
                throw "Requisição chegou no servidor, mas servidor retornou com erro: " + response.statusText
            }
            return response.json()
        })
        .then(function(usuarios) {
            console.log("Carregar usuarios:", usuarios)
            setUsuarios(usuarios)
        })
        .catch(function(error) {
            console.log(error)
        })
  }

  function criarUsuario(nomeUsuarioNovo, emailUsuarioNovo) {
    fetch("https://63442914dcae733e8fd8e3e5.mockapi.io/usuarios", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nome: nomeUsuarioNovo,
            email: emailUsuarioNovo
        })
      })
      .then(function(response) {
          if (!response.ok) {
              throw "Requisição chegou no servidor, mas servidor retornou com erro: " + response.statusText
          }
          return response.json()
      })
      .then(function(usuarioNovo) {
          setNome("")
          setEmail("")
          setUsuarios([ ...usuarios, usuarioNovo ])
      })
      .catch(function(error) {
          console.log(error)
      })
  }

  function atualizarUsuario(idUsuarioAtu, nomeUsuarioAtu, emailUsuarioAtu) {
    fetch(`https://63442914dcae733e8fd8e3e5.mockapi.io/usuarios/${idUsuarioAtu}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
                id: idUsuarioAtu,
                nome: nomeUsuarioAtu,
                email: emailUsuarioAtu
            })
        })
        .then(function(response) {
            return response.json()
        })
        .then(function(usuarioAtualizado) {
            setIdUsuario(-1)
            setNome("")
            setEmail("")
            carregarUsuarios()
        })
        .catch(function(error) {
            console.log(error)
        })
  }

  function cadastrarUsuario(event) {
    event.preventDefault()

    if (idUsuario == -1) {
        console.log("Novo usuario:", `${nome} ${email}`)
        criarUsuario(nome, email)
    } else {
        console.log("Atualiza usuario:", `${nome} ${email}`)
        atualizarUsuario(idUsuario, nome, email)     
    }
  }

  function editarUsuario(event) {
    let idUsuario = event.target.dataset.idUsuarioEditar
    if (!idUsuario) {
        idUsuario = event.target.parentElement.dataset.idUsuarioEditar
    }
    let usuario = usuarios.find(usuario => usuario.id == idUsuario)
    console.log("Edita usuario:", `${usuario.nome} ${usuario.email}`)

    setIdUsuario(usuario.id)
    setNome(usuario.nome)
    setEmail(usuario.email)
  }

  function excluirUsuario(event) {
    let idUsuario = event.target.dataset.idUsuarioEditar
    if (!idUsuario) {
        idUsuario = event.target.parentElement.dataset.idUsuarioEditar
    }

    fetch(`https://63442914dcae733e8fd8e3e5.mockapi.io/usuarios/${idUsuario}`, {
		    method: 'DELETE'
        })
        .then(function(response) {
            return response.json()
        })
        .then(function(usuario) {
            carregarUsuarios()
        })
        .catch(function(error) {
            console.log(error)
        })        
  }

  function getListaUsuarios() {
    if (busca.length > 0) return usuariosFiltrados
    return usuarios
  }

  return (
    <>
      <main className="container" style={{maxWidth: "800px"}}>
        <div className="d-flex align-items-center justify-content-center gap-2">
            <img src="user.png" alt="Imagem de usuário" />
            <h1 className="my-5">Cadastro de usuários</h1>
        </div>
        <form className="d-flex flex-column flex-md-row gap-2">
            <div className="flex-md-grow-1 mt-1">
                <label htmlFor="nome" className="form-label">Nome</label>
                <input type="nome" className="form-control" id="nome" value={nome} onChange={event => setNome(event.target.value)} />
            </div>
            <div className="flex-md-grow-1 mt-1">
                <label htmlFor="email" className="form-label">E-mail</label>
                <input type="email" className="form-control" id="email" value={email} onChange={event => setEmail(event.target.value)} />
            </div>
            <div className="mt-1 align-self-md-end">
                <button type="submit" className="btn btn-primary" onClick={cadastrarUsuario} data-id-usuario-cadastrar={idUsuario}>Cadastrar</button>
            </div>            
        </form>
        <form className="mt-5">
            <label htmlFor="busca" className="form-label">Busca</label>
            <input type="busca" className="form-control" placeholder="Busque pelo nome..." id="nome" value={busca} onChange={event => setBusca(event.target.value)} />
        </form>
        <table className="table table-hover mt-5">
            <thead>
                <tr className="d-fex align-middle">
                    <th>#</th>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th className="text-center">Acões</th>
                </tr>
            </thead>
            <tbody>
                {
                    getListaUsuarios().map((usuario, i) => {
                        return <tr key={usuario.id} className="align-middle">
                            <th>{ i + 1 }</th>
                            <td>{ usuario.nome }</td>
                            <td>{ usuario.email }</td>
                            <td className="text-center">
                                <button className="btn btn-outline-secondary ms-2" data-id-usuario-editar={usuario.id} onClick={editarUsuario}><i className="bi bi-pencil"></i></button>
                                <button className="btn btn-outline-danger ms-2" data-id-usuario-editar={usuario.id} onClick={excluirUsuario}><i className="bi bi-trash"></i></button>
                            </td>
                        </tr>
                    })
                }                
            </tbody>
        </table>
    </main>
    </>
  )
}

