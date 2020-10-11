<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credential: true');
header('Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, Authorization, Accept, X-Requested-With, x-xsrf-token');
header('Content-Type: application/json, charset=utf-8');

include 'config.php';

$postJSON = json_decode(file_get_contents('php://input'),true);
$today = date('Y-m-d H:i:s');

if ($postJSON['action'] == 'registration_progress') {
    $emailCheck = mysqli_fetch_array(mysqli_query($mysqli, "SELECT email FROM users WHERE email='$postJSON[email]'"));
    if (!empty($emailCheck['email'])) {
        if ($emailCheck['cek'] == $postJSON['email']) {
            $result = json_encode(array('success' => false, 'msg' => 'Email Sudah Terdaftar'));
        }
    }else{
        $password = md5($postJSON['password']);
        $insert = mysqli_query($mysqli, "INSERT INTO users SET
        fullname = '$postJSON[fullname]',
        gender = '$postJSON[gender]',
        datebirth = '$postJSON[datebirth]',
        email = '$postJSON[email]',
        password = '$password',
        createdat = '$today'
        ");

        if ($insert) {
            $result = json_encode(array('success' => true, 'msg' => 'Registrasi Berhasil'));
        }else{
            $result = json_encode(array('success' => false, 'msg' => 'Registrasi Gagal'));
        }
    }
    echo $result;
}elseif($postJSON['action']=='login_progress'){
    $password = md5($postJSON['password']);
    $logindata = mysqli_fetch_array(mysqli_query($mysqli, "SELECT * FROM users WHERE email = '$postJSON[email]' AND password = '$password'"));
    if ($logindata) {
        $data = array(
            'userid' => $logindata['userid'],
            'fullname' => $logindata['fullname'],
            'gender' => $logindata['gender'],
            'datebirth' => $logindata['datebirth'],
            'email' => $logindata['email']
        );
        $result = json_encode(array('success' => true, 'result' => $data));
    }
    else {
        $result = json_encode(array('success' => false));
    }
    echo $result;
} 
elseif ($postJSON['action']=='load_users'){
    $data = array();
    $query = mysqli_query($mysqli,"SELECT * FROM users ORDER BY userid DESC LIMIT $postJSON[start], $postJSON[limit]");
    while ($row = mysqli_fetch_array($query)){
        $data[] = array(
            'userid'    => $row['userid'],
            'fullname'  => $row['fullname'],
            'gender'    => $row['gender'],
            'datebirth' => $row['datebirth'],
            'email'     => $row['email']
        );
    }
    if ($query) {
        $result = json_encode(array('success' => true, 'result' => $data));
    }
    else {
        $result = json_encode(array('success' => false));
    }
    echo $result;
}
