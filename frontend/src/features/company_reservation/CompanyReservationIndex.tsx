import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { withRouter, RouteComponentProps } from "react-router-dom";
import MaterialTable from "material-table";
import GenericTemplate from "../templates/GenericTemplate";
import axios from "axios";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

type Props = {} & RouteComponentProps<{}>;

const useStyles = makeStyles({
  root: {},
  container: {
    paddingTop: 20,
    paddingBottom: 10,
  },
  pageTitle: {
    marginBottom: 10,
  },
});

const title = "企業予約マスタ";

const targetURL = `${process.env.REACT_APP_API_URL}/api/company_reservations/`;

const CompanyReservationsIndex: React.FC<Props> = (props) => {
  const classes = useStyles();
  const [entries, setEntries] = useState({
    data: [
      {
        id: "",
        reservation_year: "",
        pattern: "",
        payment_method: "",
        result_destination: "",
        company_name: "",
      },
    ],
  });

  const [state] = React.useState({
    columns: [
      { title: "ID", field: "id" },
      { title: "企業名", field: "company_name" },
      { title: "予約年", field: "reservation_year" },
      { title: "パターン", field: "pattern" },
      { title: "支払方法", field: "payment_method" },
      { title: "結果送付", field: "result_destination" },
    ],
  });

  useEffect(() => {
    axios
      .get(targetURL)
      .then((response) => {
        let data = Array();
        response.data.forEach((el) => {
          data.push({
            id: el.id,
            company_name: el.company_name,
            reservation_year: el.reservation_year,
            pattern: el.pattern,
            payment_method: el.payment_method,
            result_destination: el.result_destination,
          });
        });
        setEntries({ data: data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <GenericTemplate title={""}>
      <Container maxWidth="md" className={classes.container}>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          noWrap
          className={classes.pageTitle}
        ></Typography>
        <MaterialTable
          title={title}
          columns={state.columns}
          data={entries.data}
          editable={{
            onRowAdd: (newData) =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                  const data = [...entries.data];
                  console.log(data);
                  const payload = {
                    id: newData.id,
                    reservation_year: newData.reservation_year,
                    pattern: newData.pattern,
                    payment_method: newData.payment_method,
                    result_destination: newData.result_destination,
                    company_name: newData.company_name,
                  };
                  axios
                    .post(targetURL, newData, {
                      params: {
                        id: entries.data[0].id,
                        pattern: entries.data[0].pattern,
                      },
                    })
                    .then((res) => {
                      console.log(res.data.data);
                    });
                }, 600);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                  const data = [...entries.data];
                  // @ts-ignore
                  data[data.indexOf(oldData)] = newData;
                  axios
                    .put(`${targetURL}+${newData.id}/`, newData, {
                      params: {
                        id: entries.data[0].id,
                        reservation_year: entries.data[0].reservation_year,
                        pattern: entries.data[0].pattern,
                        payment_method: entries.data[0].payment_method,
                        result_destination: entries.data[0].result_destination,
                        company: entries.data[0].company_name,
                      },
                    })
                    .then((res) => console.log(res.data));
                  setEntries({ ...entries, data });
                }, 600);
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve();
                  const data = [...entries.data];
                  data.splice(data.indexOf(oldData), 1);
                  axios
                    .delete(`${targetURL}+${oldData.id}/`, {
                      params: {
                        id: entries.data[0].id,
                      },
                    })
                    .then((res) => console.log(res.data));
                  setEntries({ ...entries, data });
                }, 600);
              }),
          }}
        />
      </Container>
    </GenericTemplate>
  );
};

export default withRouter(CompanyReservationsIndex);
