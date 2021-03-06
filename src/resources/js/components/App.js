import React from 'react';
import Header from './Header';
import Toolbar from './Toolbar';
import pages from './pages/factory'
import { inject, observer } from "mobx-react"
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EngineFactory from '../EngineFactory'

@inject('store') @observer
export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            booted: false
        }
    }

    render() {
        return (
            <div >
                <Header />
                <Toolbar />
                {this.state.booted && this.renderActivePage()}
                <ToastContainer style={{paddingTop: '0px'}} />
            </div>
        );
    }

    renderActivePage()
    {
        let Page =  pages(this.props.store.metadata.page)
        return (<Page />)
    }
    
    componentDidMount() {
        this.boot()
        this.registerKeybindings()
        this.registerExitConfirmation()     
    }

    boot() {
        // NORMAL PHP CLIENT
        //let server = new RemoteServerClient('/datastory/api')

        this.props.store.metadata.server.boot({
            story: window.location.href.split("/datastory").pop().replace('/', '')
        }).then((response) => {
            this.props.store.setEngine(
                EngineFactory.loadOrCreate(
                    response.data.serializedModel ?? null
                )
            )

            this.props.store.setAvailableNodes(
                response.data.capabilities.availableNodes
            );

            this.props.store.setStories(
                response.data.stories
            );


            this.setState({
                booted: true
            })
        })
        .catch(error => {
            console.log('Boot error', error)
            this.showBootFailureToast()
        });
    }

    registerKeybindings() {
        Mousetrap.bind(
            'shift+d',
            (e) => {
                this.props.store.setPage('Workbench')
            }
        );

        Mousetrap.bind(
            'shift+t',
            (e) => {
                this.props.store.setPage('Inspector')
            }
        ); 
    }
    
    registerExitConfirmation() {
        window.onbeforeunload = function(e) {
            return "Do you want to exit this page?";
        };        
    }

    showBootFailureToast()
    {
        toast.info(' Could not Boot! Check console.', {
            position: "bottom-right",
            transition: Slide,
            autoClose: 3500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }
}