import { Card, CardBody, CardTitle, Table } from 'reactstrap';
import Image from '~/components/Image';
const TopUser = ({ data }) => {
    const tableData = data.map((item) => ({
        avatar: item.avatar, 
        name: item.nickName,
        totalMusic: item.totalMusic, 
        totalAmount: item.totalAmount, 
        totalFollower: item.totalFollower, 
    }));
    return (
        <div>
            <Card>
                <CardBody>
                    <CardTitle tag="h3">Tài khoản đăng nhạc nhiều nhất</CardTitle>

                    <Table className="no-wrap mt-3 align-middle" responsive borderless>
                        <thead>
                            <tr>
                                <th>Tên người dùng</th>
                                <th>Số nhạc đã đăng</th>
                                <th>Số tiền đã nạp</th>
                                <th>Số người theo dõi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((tdata, index) => (
                                <tr key={index} className="border-top">
                                    <td>
                                        <div className="d-flex align-items-center p-2">
                                            <Image
                                                src={tdata?.avatar?.url}
                                                className="rounded-circle"
                                                alt="avatar"
                                                width="45"
                                                height="45"
                                            />
                                            <div className="ms-3">
                                                <h6 className="mb-0">{tdata.name}</h6>
                                             
                                            </div>
                                        </div>
                                    </td>
                                    <td>{tdata.totalMusic}</td>
                                    <td>{tdata.totalAmount}</td>
                                   
                                    <td>{tdata.totalFollower}</td>
                      
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
        </div>
    );
};

export default TopUser;
