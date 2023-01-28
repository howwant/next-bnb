import  App, { AppContext, AppProps } from "next/app";
import GlobalStyle from "../styles/GlobalStyle";
import { wrapper } from "../store";
import axios from "../lib/api";
import { cookieStringToObject } from "../lib/utils";
import { meAPI } from "../lib/api/auth";
import { userActions } from "../store/user";

const app = ({ Component, pageProps }: AppProps) => {
    return (
        <>
            <GlobalStyle/>
            <Component {...pageProps} />
            <div id="root-modal"/>
        </>
    );
};

//* 로그인 유지
//https://github.com/kirill-konshin/next-redux-wrapper#app
app.getInitialProps = wrapper.getInitialAppProps(store => async context => {
    const appInitalProps = await App.getInitialProps(context);
    const cookieObject = cookieStringToObject(context.ctx.req?.headers.cookie);
    try{
        if(cookieObject.access_token){
            axios.defaults.headers.common['cookie'] = cookieObject.access_token;
            const {data} = await meAPI();
            store.dispatch(userActions.setLoggedUser(data));
        }
    }
    catch(e){
         console.log(e);
    }
    return {...appInitalProps};
})

export default wrapper.withRedux(app);