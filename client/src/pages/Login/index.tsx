import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { FC, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { FormikInput } from '../../components';
import { useAuthContext } from '../../context';
import { setAccessToken } from '../../utils';
import axios from '../../utils/axios';
import { toErrorMap } from '../../utils/toErrorMap';

export const Login: FC<RouteComponentProps> = ({ history }) => {
  const [, setAuthState] = useAuthContext();
  const [loading, setLoading] = useState(false);

  return (
    <Flex h="100vh" justify="center" align="center">
      <Box mx={4} w={300} maxW={400} textAlign="center">
        <Text fontSize="3xl" fontWeight="hairline">
          LOGIN
        </Text>
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={async (values, { setErrors }) => {
            setLoading(true);
            try {
              //login
              const res = await axios.post(
                `${process.env.REACT_APP_API}/users/login`,
                {
                  email: values.email,
                  password: values.password,
                }
              );
              if (res.data.token) {
                setAccessToken(res.data.token);
                setAuthState({ loggedIn: true });
              } else if (res.data.errors) {
                setErrors(toErrorMap(res.data.errors));
                setLoading(false);
              }
            } catch (e) {
              console.log(e);
            }
          }}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <FormikInput
                name="email"
                label="USERNAME/EMAIL"
                placeholder="Enter username/email address.."
              />
              <FormikInput
                name="password"
                label="PASSWORD"
                placeholder="Enter password.."
                type="password"
              />
              <Button
                disabled={loading}
                isLoading={loading}
                mt={4}
                w="100%"
                colorScheme="purple"
                type="submit"
              >
                SIGN IN
              </Button>
              <Text mt={1} fontSize="sm">
                Don't have an account yet? click{' '}
                <Text color="purple.400" as={Link} to="/register">
                  here
                </Text>
              </Text>
            </Form>
          )}
        </Formik>
      </Box>
    </Flex>
  );
};
