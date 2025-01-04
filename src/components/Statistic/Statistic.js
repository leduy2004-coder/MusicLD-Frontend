import { useEffect, useState } from 'react';
import { Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import { UserAuth } from '~/components/Store';
import { UserNotify } from '../Store';
import MusicChart from './Chart';
import General from './General';
import TopUser from './TopUser';

import config from '~/services';

function Statistic() {
    const currentYear = new Date().getFullYear(); // Lấy năm hiện tại
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const { setInfoNotify } = UserNotify();
    const [dataMusicChart, setDataMusicChart] = useState([]);
    const [dataTopUser, setDataTopUser] = useState([]);
    const [generalData, setGeneralData] = useState({
        sumMovie: 0,
        sumTurnover: 0,
        sumTicket: 0,
    });
    const { userAuth, tokenStr, setOpenFormLogin } = UserAuth();

    // Hàm tạo danh sách năm từ 2023 đến năm hiện tại
    const getYearOptions = () => {
        const startYear = 2023;
        const years = [];
        for (let year = startYear; year <= currentYear; year++) {
            years.push(year);
        }
        return years;
    };
    // Hàm gọi API và cập nhật dữ liệu
    const fetchData = async (year) => {
        try {
            const [musicData, topUserData, statisticData] = await Promise.all([
                config.getCountMusicByYear(year, tokenStr),
                config.getTopUserByYear(year, tokenStr),
                config.getStatisticByYear(year, tokenStr),
            ]);

            if (musicData.errCode || topUserData.errCode || statisticData.errCode) {
                setInfoNotify({
                    content: 'Lỗi dữ liệu !!',
                    delay: 1500,
                    isNotify: true,
                    type: 'error',
                });
            } else {
                setDataMusicChart(musicData);
                setDataTopUser(topUserData);

                // Cập nhật dữ liệu vào generalData
                setGeneralData({
                    totalMusic: statisticData.totalMusic,
                    totalAmount: statisticData.totalAmount,
                    totalAccount: statisticData.totalAccount,
                });
            }
        } catch (error) {
            setInfoNotify({
                content: 'Lỗi khi lấy dữ liệu từ server !!',
                delay: 1500,
                isNotify: true,
                type: 'error',
            });
        }
    };
    // Gọi hàm fetchData khi component load lần đầu hoặc khi selectedYear thay đổi
    useEffect(() => {
        if (tokenStr) fetchData(selectedYear);
    }, [selectedYear, tokenStr]);

    const handleYearChange = (e) => {
        setSelectedYear(e.target.value); // Cập nhật năm đã chọn
    };
    return (
        <div>
            {/***Top Cards***/}

            {/***Sales & Feed***/}
            <Row className="mb-4">
                {/* ComboBox for Year */}
                <Col sm="12">
                    <Form>
                        <FormGroup>
                            <Label for="yearSelect">Chọn năm</Label>
                            <Input
                                type="select"
                                name="year"
                                id="yearSelect"
                                value={selectedYear}
                                onChange={handleYearChange}
                                style={{ fontSize: '16px' }}
                            >
                                {getYearOptions().map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Form>
                </Col>
            </Row>

            <Row>
                <Col sm="6" lg="6" xl="7" xxl="8">
                    <MusicChart data={dataMusicChart} />
                </Col>
                <Col sm="6" lg="6" xl="5" xxl="4">
                    <General data={generalData} />
                </Col>
            </Row>
            {/***Table ***/}
            <Row>
                <Col lg="12">
                    <TopUser data={dataTopUser} />
                </Col>
            </Row>
        </div>
    );
}

export default Statistic;
