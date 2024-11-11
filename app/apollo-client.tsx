import { ApolloClient, InMemoryCache, gql} from '@apollo/client';

const apiCall= async (uri: string, schema: string, data: any, isMutate: boolean)=>{
    try {

        const client = new ApolloClient({
            uri: uri,
            cache: new InMemoryCache(),
            credentials: "include"
        });


        if(isMutate){
            const result = await client.mutate({
                mutation: gql`${schema}`,
                variables: data? {...data} : undefined
            })
            return result
        }
        else{
            const result = await client.query({
                query: gql`${schema}`,
                variables: data? {...data} : undefined
            })
            return result
        }
    } catch (error: any) {
        console.error('error:', error);
        throw new Error(error.message)
    }
    
}

export default apiCall
    



















// const client = new ApolloClient({
//     uri: 'http://localhost:5000/graphql',
//     cache: new InMemoryCache(),
// });

// const SIGNUP_MUTATION = gql`
//   mutation Signup($firstName: String!, $lastName: String!, $username: String!, $password: String!) {
//     signup(firstName: $firstName, lastName: $lastName, username: $username, password: $password) {
//       token
//     }
//   }
// `;

// interface SignupInput { 
//     firstName: string; lastName: string; 
//     username: string; password: string; 
// }
// export const signupUser = async ({ firstName, lastName, username, password }: SignupInput) => {
//   try {
//     const result = await client.mutate({
//       mutation: SIGNUP_MUTATION,
//       variables: {
//         firstName,
//         lastName,
//         username,
//         password
//       },
//     });
//     console.log('Signup result:', result);
//     return result.data.signup.token; // or handle the response as needed
//   } catch (error) {
//     console.error('Signup error:', error);
//     throw error;
//   }
// };

// export default client;


























// import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

// const client = new ApolloClient({
//     uri: 'http://localhost:5000/graphql',
//     cache: new InMemoryCache(),
// });

// const SIGNUP_MUTATION = gql`
//   mutation Signup($firstName: String!, $lastName: String!, $username: String!, $password: String!) {
//     signup(firstName: $firstName, lastName: $lastName, username: $username, password: $password) {
//       token
//     }
//   }
// `;

// client
//   .mutate({
//     mutation: SIGNUP_MUTATION,
//     variables: {
//       firstName: "John",  // Replace with actual values
//       lastName: "Doe",    // Replace with actual values
//       username: "johndoe", // Replace with actual values
//       password: "password123" // Replace with actual values
//     },
//   })
//   .then((result) => console.log(result))
//   .catch((error) => console.error(error));

// export default client;
