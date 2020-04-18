import React, { useState, useEffect } from 'react';
import { Spinner,Card, CardImg, CardBody, CardTitle, Button } from 'reactstrap';

import api from '../actions/api';

const Body = () => {

    const [pokemons, setPokemons] = useState([]);
    const [total, setTotal] = useState(0);
    const [counter, setCounter] = useState(0);
    const [pokeName, setName] =useState('');
    const [poke, setPokeInfo] = useState([]);
    const [types, setTypes] = useState([]);
    const [info, setHasInfo] = useState(false);
    const [loading,setLoading]= useState(false);

    useEffect(()=>{
        setLoading(true)
        setTimeout(async ()=>{
            await api.get(`/pokemon/`).then(response=>{
                setLoading(false)
                const data = response.data.results.map(item => ({
                    ...item,
                    number: item.url.split('/')[6],
                }));
                setPokemons(data)
                setTotal(response.data.count)
                setCounter(response.data.results.length)
            })
        },2000)
    },[])

    const getPokeInfo=async(id,name)=>{
        await api.get(`/pokemon/${id}`).then(response=>{
            setPokeInfo(response.data)
            setTypes(response.data.types)
            setHasInfo(true)
            setName(name)
        })
    }

    const close=()=>{
        setName('')
        setHasInfo(false)
        setTypes([])
    }

    const next = async ()=>{
        if(counter<total){
            await api.get(`/pokemon?offset=${counter}&limit=20`).then(response=>{
                setLoading(false)
                const data = response.data.results.map(item => ({
                    ...item,
                    number: item.url.split('/')[6],
                }));
                setPokemons(data)
                setCounter(counter+20)
            })
        }
    }

    const previous = async ()=>{
        if(counter>20){
            await api.get(`/pokemon?offset=${counter-40}&limit=20`).then(response=>{
                setLoading(false)
                const data = response.data.results.map(item => ({
                    ...item,
                    number: item.url.split('/')[6],
                }));
                setPokemons(data)
                setCounter(counter-20)
            })
        }
    }

    return (
        <div className="column">
            {loading ? <div className="box"><Spinner color="success"/></div> : 
                <div className="flex">
                {pokemons.map((pokemon,index)=>{
                    return <div key={index} className="item">
                        <Card className="m-2 shadow">
                            <CardImg top src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.number}.png`} height="200" alt="Card image cap" />
                            <CardBody>
                            <CardTitle className="text-center"><h4 className="pokemon-name">{pokemon.name}</h4></CardTitle>
                            {info && pokemon.name==pokeName ?
                            <Button className="text-center" color="danger" style={{width:'100%'}} onClick={()=>close()}>Fechar</Button>
                            :<Button className="text-center" color="success" style={{width:'100%'}} onClick={(i,n)=>getPokeInfo(pokemon.number,pokemon.name)}>Detalhes</Button>
                            } 
                             {info && pokemon.name==pokeName ?<CardBody>
                                    <CardTitle>Weight: {poke.weight} kg</CardTitle>
                                    <CardTitle>Height: {poke.height} </CardTitle>
                                    {types.map((type,index)=>{
                                        return <span key={index} className="mr-2 badge badge-primary">{type.type.name}</span>
                                    })}
                                </CardBody> : <></>}
                            </CardBody>
                        </Card>
                    </div>
                })}
                </div> 
            }{
                loading ? <></>:
                <div className="flex">
                    <Button className="item m-4" color={counter>20 ? "primary" : "secondary"} onClick={()=>previous()}>Anterior</Button>
                    <Button className="item m-4" color={counter<total ? "primary" : "secondary"} onClick={()=>next()}>Proximo</Button>
                </div>    
            }
        </div>
    )
}

export default Body;