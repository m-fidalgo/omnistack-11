import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, Image, Text, TouchableOpacity, FlatList, Alert, AsyncStorage} from 'react-native';
import style from './style';
import api from '../../services/api';

//imgs e icons
import imgLogo from '../../assets/logo.png';
import {Feather} from '@expo/vector-icons';

export default function Incidents(){
    const [casos, setCasos] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const [tipo, setTipo] = useState('t');

    /*async function getItem() {
        return await AsyncStorage.getItem('tipo')
            .then((result) => {
                if (result) {
                    setTipo(result);
                }
                else{
                    setTipo('t');
                }
                return tipo;
            });
    }

    async function setItem() {
        return await AsyncStorage.setItem('tipo', JSON.stringify(tipo));
    }*/

    function navigateToDetail(caso){
        navigation.navigate('Details', {caso});
    }

    function navigateToLogin(){
        navigation.navigate('Login');
    }

    function navigateToOng(caso){
        navigation.navigate('Ong',{caso});
    }

    function openFiltro(){
        Alert.alert(
            'Selecione o tipo de ONG',
            '',
            [
                {text: 'Todos', onPress: () => loadT()},
                {text: 'Animais', onPress: () => loadA()},
                {text: 'Direitos Humanos', onPress:() => loadD()},
                {text: 'Meio Ambiente', onPress: () => loadM()},
            ],
            { cancelable: false }
        );
    }

    async function loadT(){
        setTipo('t')
        await api.get('casos',{
            headers:{
                type: 't',
            },
            params: {page: 1}
        }).then(resp => {
            setCasos(resp.data);
            setTotal(resp.headers['x-total-count']);
            setPage(2);
           })
    }

    async function loadA(){
        setTipo('a')
        await api.get('casos',{
            headers:{
                type: 'a',
            },
            params: {page: 1}
        }).then(resp => {
            setCasos(resp.data);
            setTotal(resp.headers['x-total-count']);
            setPage(2);
           })
    }

    async function loadD(){
        setTipo('d')
        await api.get('casos',{
            headers:{
                type: 'd',
            },
            params: {page: 1}
        }).then(resp => {
            setCasos(resp.data);
            setTotal(resp.headers['x-total-count']);
            setPage(2);
           })
    }

    async function loadM(){
        setTipo('m')
        await api.get('casos',{
            headers:{
                type: 'm',
            },
            params: {page: 1}
        }).then(resp => {
            setCasos(resp.data);
            setTotal(resp.headers['x-total-count']);
            setPage(2);
           })
    }

    async function loadIncidents(){
        if(loading){
            return;
        }

        if(total > 0 && casos.length == total){
            return;
        }

        setLoading(true);

        const resp = await api.get('casos',{
            params: {page},
            headers: {
                type: tipo
            }
        });

        setCasos([... casos, ...resp.data]);
        setTotal(resp.headers['x-total-count']);
        setPage(page + 1);
        setLoading(false);
    }

    useEffect(() => {
       loadIncidents();
    }, []);

    return(
        <View style={style.container}>
            <View style={style.header}>
                <Image source={imgLogo} />

                <View style={style.headerRight}>
                    <Text style={style.headerText}>
                        Total de <Text style={style.headerTextBold}>{total} casos</Text>.
                    </Text>

                    <TouchableOpacity style={[{marginLeft: 24}]} onPress={navigateToLogin}>
                        <Feather name="power" size={28} color="#e02041" />
                    </TouchableOpacity>
                </View>

                
            </View>

            <View style={style.titleBox}>
                <Text style={style.title}>Bem vindo(a)</Text>

                <TouchableOpacity style={style.filtro} onPress={() => openFiltro()}>
                    <Text style={style.filtroText}>Filtrar</Text>
                    <Feather name="filter" size={16} color="#e02041" />
                </TouchableOpacity>
            </View>
            
            <Text style={style.desc}>Escolha um dos casos abaixo e salve o dia</Text>

            <FlatList
                style={style.list}
                data={casos}
                keyExtractor={caso => String(caso.id)}
                showsVerticalScrollIndicator={false}
                onEndReached={loadIncidents}
                onEndReachedThreshold={0.2}
                renderItem={({item: caso}) => (
                    <View style={style.incident}>
                        <TouchableOpacity onPress={() => navigateToOng(caso)}>
                            <Text style={style.incidentProperty}>ONG:</Text>
                            <Text style={style.incidentValue}>{caso.nome}</Text>
                        </TouchableOpacity>

                        <Text style={style.incidentProperty}>TIPO:</Text>
                        <Text style={style.incidentValue}>{caso.tipo}</Text>

                        <Text style={style.incidentProperty}>CASO:</Text>
                        <Text style={style.incidentValue}>{caso.titulo}</Text>

                        <Text style={style.incidentProperty}>VALOR:</Text>
                        <Text style={style.incidentValue}>{Intl.NumberFormat('pt-BR',{style: 'currency', currency: 'BRL'}).format(caso.valor)}</Text>

                        <TouchableOpacity 
                            style={style.detailsBtn} 
                            onPress={() => navigateToDetail(caso)}
                        >
                            <Text style={style.detailsBtnText}>Ver mais detalhes</Text>
                            <Feather name="arrow-right" size={16} color="#e02041" />
                        </TouchableOpacity>
                    </View>
                )}
            />        
        </View>
    );
}