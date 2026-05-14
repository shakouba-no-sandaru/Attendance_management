//勤怠データ取得
export const getAttendances = (): string => {
    const attendances: string = `
    SELECT
        employee_id,
        year,
        month,
        day,
        clock_in_time,
        clock_out_time,
        break_time ,
        CASE
            WHEN TIMEDIFF(TIMEDIFF(clock_out_time, clock_in_time), break_time) < '00:00:00' THEN '00:00:00' 
            ELSE TIMEDIFF(TIMEDIFF(clock_out_time, clock_in_time), break_time)
        END AS working_time,
        remarks
    FROM
        attendance_management
    WHERE
        employee_id = ?
    AND
        year = ?
    AND
        month = ?
    `;
    return attendances;
}

//リスト用勤怠データ取得
export const getSumAttendancesList = (): string => {
    const getSumAttendancesList: string = `
    SELECT
        employee_id,
        year,
        month,
        day,
        TIME_FORMAT(SEC_TO_TIME(CEIL(TIME_TO_SEC(clock_in_time) / 1800) * 1800), '%k:%i') AS clock_in_time,
        TIME_FORMAT(SEC_TO_TIME(FLOOR(TIME_TO_SEC(clock_out_time) / 1800) * 1800), '%k:%i') AS clock_out_time,
        TIME_FORMAT(break_time, '%k:%i') AS break_time,
        TIME_FORMAT(SEC_TO_TIME(
            CASE
                WHEN TIMEDIFF(TIMEDIFF( SEC_TO_TIME(FLOOR(TIME_TO_SEC(clock_out_time) / 1800) * 1800),
                                        SEC_TO_TIME(CEIL(TIME_TO_SEC(clock_in_time) / 1800) * 1800)), break_time) < '00:00:00' THEN 0
                ELSE TIME_TO_SEC(TIMEDIFF(TIMEDIFF( SEC_TO_TIME(FLOOR(TIME_TO_SEC(clock_out_time) / 1800) * 1800),
                                        SEC_TO_TIME(CEIL(TIME_TO_SEC(clock_in_time) / 1800) * 1800)), break_time))
            END
        ), '%k:%i') AS working_time,
        remarks
    FROM
        attendance_management
    WHERE
        employee_id = ?
    AND
        year = ?
    AND
        month = ?
    `;
    return getSumAttendancesList;
}

// 勤怠合計データ取得
export const getSumAttendances = (): string => {
    const sumAttendances: string = `
SELECT 
    COUNT(*) AS total_records,
    TIME_FORMAT(SEC_TO_TIME(SUM(
        CASE
            WHEN TIMEDIFF(TIMEDIFF( SEC_TO_TIME(FLOOR(TIME_TO_SEC(clock_out_time) / 1800) * 1800),
                                    SEC_TO_TIME(CEIL(TIME_TO_SEC(clock_in_time) / 1800) * 1800)), break_time) < '00:00:00' THEN 0
            ELSE TIME_TO_SEC(TIMEDIFF(TIMEDIFF( SEC_TO_TIME(FLOOR(TIME_TO_SEC(clock_out_time) / 1800) * 1800),
                                    SEC_TO_TIME(CEIL(TIME_TO_SEC(clock_in_time) / 1800) * 1800)), break_time))
        END
    )), '%H:%i:%s') AS total_working_time
FROM 
    attendance_management
WHERE
    employee_id = ?
AND
    year = ?
AND
    month = ?;

    `;
    return sumAttendances;
}

// 勤怠データ取得（日ごと）
export const getAttUpdateInfo = (): string => {
    const getAttUpdateInfo: string = `
    SELECT
        *
    FROM
        attendance_management
    WHERE
        employee_id = ?
    AND
        year = ?
    AND
        month = ?
    AND
        day = ?
    `;
    return getAttUpdateInfo;
}

// 勤怠データ登録有無
export const chkAttData = (): string => {
    const chkAttData: string = `
    SELECT
        count(*) AS chkAttData
    FROM
        attendance_management
    WHERE
        employee_id = ?
    AND
        year = ? 
    AND
        month = ?
    AND
        day = ?
    `;
    return chkAttData;
}


// 勤怠情報登録（日ごと）
export const regAttInsert = (): string => {
    const regAttInsert: string = `
    INSERT INTO attendance_management (
        employee_id,
        year,
        month,
        day,
        clock_in_time,
        clock_out_time,
        break_time,
        remarks
    )
    VALUES (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
    ) 
    `;
    return regAttInsert;
}

// 勤怠情報更新（日ごと）
export const regAttUpdate = (): string => {
    const regAttUpdate: string = `
    UPDATE
        attendance_management
    SET
        clock_in_time = ?,
        clock_out_time = ?,
        break_time = ?,
        remarks = ?
    WHERE
        employee_id = ?
    AND
        year = ? 
    AND
        month = ?
    AND
        day = ?
    `;
    return regAttUpdate;
}



//全従業員データ取得
export const getEmployees = (): string => {
    const employees: string = `
    SELECT
        em.employee_id,
        em.employee_name,
        em.employee_kana,
        em.mail_address,
        pm.post_name,
        em.login_id,
        em.pass_word
    FROM
        employee_master as em
    INNER JOIN
        post_master as pm
    ON
        em.employee_post = pm.employee_post
    `;
    return employees;
}

export const getEmployeesOne = (): string => {
    const employeesOne: string = `
    SELECT
        employee_name
    FROM
        employee_master
    `;
    return employeesOne;
}

export const getLoginInfo = (): string => {
    const loginInfo: string = `
    SELECT
        *
    FROM
        employee_master
    WHERE
        login_id = ?
    `;
    return loginInfo;
}

// 従業員チェック
export const EmployeeDataCheck = (): string => {
    const EmployeeDataCheck: string = `
    SELECT
        count(*) AS count
    FROM
        employee_master
    WHERE
        login_id = ?
    `;
    return EmployeeDataCheck;
}

// 従業員ID管理データ取得
export const regEmployeeNowId = (): string => {
    const regEmployeeNowId: string = `
    SELECT
        employee_id
    FROM
        employee_id_pool
    `;
    return regEmployeeNowId;
}

// 従業員ID管理テーブル更新
export const regEmployeeIdPool = (): string => {
    const regEmployeeIdPool: string = `
    UPDATE
        employee_id_pool
    SET
        employee_id = employee_id +1
    WHERE
        employee_id > 0
    `;
    return regEmployeeIdPool;
}


// 従業員データ登録
export const regEmployeeData = (): string => {
    const employeeData: string = `
    INSERT INTO employee_master(
        employee_id,
        employee_name,
        employee_kana,
        mail_address,
        employee_post,
        login_id,
        pass_word
    )
    SELECT
        employee_id,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
    FROM
        employee_id_pool
    LIMIT 1
    `;
    return employeeData;
}

// 従業員データ削除
export const delEmployeeData = (): string => {
    const employeeData: string = `
    DELETE
    FROM
        employee_master
    WHERE
        employee_id = ?
    AND
        login_id = ?
    `;
    return employeeData;
}


// 出勤情報登録
export const regInTime = (): string => {
    const regInTime: string = `
    INSERT INTO attendance_management (
        employee_id,
        year,
        month,
        day,
        clock_in_time,
        clock_out_time,
        break_time,
        remarks
    )
    VALUES (
        ?,
        ?,
        ?,
        ?,
        ?,
        null,
        null,
        null
    ) 
    `;
    return regInTime;
}

// 出勤情報登録(UPDATE)
export const regInTimeUd = (): string => {
    const regInTimeUd: string = `
    UPDATE
        attendance_management
    SET
        clock_in_time = ?
    WHERE
        employee_id = ?
    AND
        year = ? 
    AND
        month = ?
    AND
        day = ?
    `;
    return regInTimeUd;
}

// 退勤情報登録
export const regOutTime = (): string => {
    const regOutTime: string = `
    UPDATE
        attendance_management
    SET
        clock_out_time = ?,
        break_time = ?
    WHERE
        employee_id = ?
    AND
        year = ? 
    AND
        month = ?
    AND
        day = ?
    `;
    return regOutTime;
}

// 申請状況取得
export const getAppData = (): string => {
    const getAppData: string = `
    SELECT
        *
    FROM
        application_approval
    WHERE
        employee_id = ?
    ORDER BY
        year    DESC,
        month   DESC
    LIMIT 1
    `;
    return getAppData;
}

// 承認状況取得
export const getApprovalData = (): string => {
    const getApprovalData: string = `
    SELECT
        em.employee_name,
        aa.*
    FROM
        application_approval AS aa
	LEFT JOIN
        employee_master AS em
    ON
        aa.employee_id = em.employee_id
    WHERE
        application_status = 1
    AND
        approval_status = 0
    ORDER BY
        employee_id    ASC
    `;
    return getApprovalData;
}

// 申請状況更新
export const appRequest = (): string => {
    const appRequest: string = `
    UPDATE
        application_approval
    SET
        application_status = 1
    WHERE
        employee_id = ?
    AND
        application_status = 0
    `;
    return appRequest;
}


// 承認状況更新
export const appCompleted = (): string => {
    const appCompleted: string = `
    UPDATE
        application_approval
    SET
        application_status = 2,
        approval_status = 1
    WHERE
        employee_id = ?
    AND
        approval_status = 0
    `;
    return appCompleted;
}

// 新規ユーザ申請年月作成
export const regNewUserAppData = (): string => {
    const regNewUserAppData: string = `
    INSERT INTO application_approval (
        employee_id,
        year,
        month,
        application_status,
        approval_status
    )
    VALUES (
        ?,
        ?,
        ?,
        0,
        0
    )
    `;
    return regNewUserAppData;
}

// 翌月申請年月作成
export const regAppData = (): string => {
    const regAppData: string = `
    INSERT INTO application_approval (
        employee_id,
        year,
        month,
        application_status,
        approval_status
    )
    SELECT
        employee_id,
        CASE 
            WHEN month = 12 THEN year + 1
            ELSE year
        END AS next_year,
        CASE 
            WHEN month = 12 THEN 1
            ELSE month + 1
        END AS next_month,
        0 AS application_status,
        0 AS approval_status
    FROM (
        SELECT
            employee_id,
            year,
            month
        FROM
            application_approval
        WHERE
            employee_id = ?
        ORDER BY
            year    DESC,
            month   DESC
        LIMIT 1
    ) AS latest_record
    `;
    return regAppData;
}

// 祝日情報取得
export const getHolidayData = (): string => {
    const getHolidayData: string = `
    SELECT
        day,
        holiday
    FROM
        holidays
    WHERE
        year = ?
    AND
        month = ?
    `;
    return getHolidayData;
}




