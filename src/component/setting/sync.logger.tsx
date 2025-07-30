'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Button, Typography, Space, Badge, Tooltip, message } from 'antd';
import { FileTextOutlined, ClearOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import styled from 'styled-components';

const ConsoleContainer = styled.div`
  background-color: #1e1e1e;
  color: #ffffff;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.4;
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  
  @media (max-width: 768px) {
    font-size: 11px;
    padding: 12px;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #2d2d2d;
  }
  &::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #777;
  }
`;

const LogLine = styled.div`
  margin-bottom: 2px;
  word-wrap: break-word;

  .timestamp {
    color: #666;
    margin-right: 8px;
  }
  .message {
    color: #ffffff;
  }
`;

interface SyncLogEntry {
    id: string;
    timestamp: string;
    message: string;
}

interface SyncLoggerProps {
    connectionId: string;
    migratedProducts: number;
    migratedContacts: number;
    migratedOrders: number;
    isSyncing: boolean;
    lastSyncedCounts: {
        product: number;
        customer: number;
        order: number;
    };
}

const SyncLogger: React.FC<SyncLoggerProps> = ({
    connectionId,
    migratedProducts,
    migratedContacts,
    migratedOrders,
    isSyncing,
    lastSyncedCounts,
}) => {
    const [logs, setLogs] = useState<SyncLogEntry[]>([]);
    const [previousCounts, setPreviousCounts] = useState({
        product: migratedProducts,
        customer: migratedContacts,
        order: migratedOrders,
    });
    // Khởi tạo wasSyncing = isSyncing để tránh log “ALL MODULES sync started” khi reload nếu đã đang syncing
    const [wasSyncing, setWasSyncing] = useState(isSyncing);

    // Ref để đánh dấu đã khởi tạo previousCounts từ SSE (để tránh log diff lần đầu)
    const initializedRef = useRef(false);

    // Quản lý trạng thái hiển thị console qua localStorage
    const [isModalVisible, setIsModalVisible] = useState(() => {
        const storedVisible = localStorage.getItem(`sync_logger_visible_${connectionId}`);
        return storedVisible ? JSON.parse(storedVisible) : false;
    });

    useEffect(() => {
        localStorage.setItem(`sync_logger_visible_${connectionId}`, JSON.stringify(isModalVisible));
    }, [isModalVisible, connectionId]);

    const consoleRef = useRef<HTMLDivElement>(null);
    const STORAGE_KEY = `sync_logs_${connectionId}`;

    // Tải log từ localStorage khi component mount
    useEffect(() => {
        try
        {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored)
            {
                const parsed: SyncLogEntry[] = JSON.parse(stored);
                setLogs([]);
            }
        } catch (error)
        {
            console.error('Error loading logs:', error);
        }
    }, [connectionId]);

    // Khi nhận giá trị mới từ SSE lần đầu, cập nhật previousCounts và đánh dấu initializedRef
    useEffect(() => {
        if (!initializedRef.current)
        {
            setPreviousCounts({
                product: migratedProducts,
                customer: migratedContacts,
                order: migratedOrders,
            });
            initializedRef.current = true;
        }
    }, [migratedProducts, migratedContacts, migratedOrders]);

    // Hiệu ứng: khi isSyncing chuyển từ false -> true, hoặc true -> false
    useEffect(() => {
        if (isSyncing && !wasSyncing)
        {
            // Bắt đầu sync mới: xóa logs cũ và ghi “ALL MODULES sync started”
            setLogs([]);
            localStorage.removeItem(STORAGE_KEY);

            setPreviousCounts({
                product: lastSyncedCounts.product,
                customer: lastSyncedCounts.customer,
                order: lastSyncedCounts.order,
            });
            initializedRef.current = true; // Đánh dấu đã initialize lại counts
            addLog('ALL MODULES sync started');
        } else if (!isSyncing && wasSyncing)
        {
            // Khi sync kết thúc
            addLog('Sync completed');
        }
        setWasSyncing(isSyncing);
    }, [isSyncing, lastSyncedCounts]);

    // Hiệu ứng: ghi log tăng record khi đang syncing (chỉ sau lần initialize đầu)
    useEffect(() => {
        if (isSyncing && initializedRef.current)
        {
            const modules = [
                { name: 'product', count: migratedProducts },
                { name: 'customer', count: migratedContacts },
                { name: 'order', count: migratedOrders },
            ];
            modules.forEach(({ name, count }) => {
                // @ts-ignore
                const prevCount = previousCounts[name];
                if (count > prevCount)
                {
                    const diff = count - prevCount;
                    addLog(`${name.toUpperCase()}S synced +${diff} records`);
                    setPreviousCounts((prev) => ({ ...prev, [name]: count }));
                }
            });
        }
    }, [migratedProducts, migratedContacts, migratedOrders, isSyncing, previousCounts]);

    // Tự động scroll xuống cuối khi có log mới
    useEffect(() => {
        if (consoleRef.current)
        {
            consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
        }
    }, [logs]);

    // Hàm thêm log mới
    const addLog = (msg: string) => {
        const newLog: SyncLogEntry = {
            id: `${Date.now()}_${Math.random()}`,
            timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            message: msg,
        };
        const updated = [...logs, newLog];
        setLogs(updated);
        try
        {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (error)
        {
            console.error('Error saving logs:', error);
        }
    };

    // Hàm xóa log
    const clearLogs = () => {
        try
        {
            localStorage.removeItem(STORAGE_KEY);
            setLogs([]);
            message.success('Sync logs cleared');
        } catch (error)
        {
            message.error('Failed to clear logs');
            console.error('Error clearing logs:', error);
        }
    };

    // Tính số log trong 24h để hiển thị badge
    const activeLogs = logs.filter((l) => dayjs().diff(dayjs(l.timestamp), 'hour') < 24);

    return (
        <>
            <div style={{ marginTop: 24, marginBottom: 24, textAlign: 'center' }}>
                <Tooltip title="View sync activity logs">
                    <Button
                        icon={<FileTextOutlined />}
                        onClick={() => setIsModalVisible(!isModalVisible)}
                        style={{
                            borderColor: '#666',
                            color: '#666',
                            backgroundColor: '#fafafa',
                            marginTop: 20,
                        }}
                    >
                        {isModalVisible ? 'Hide Sync Logs' : 'Show Sync Logs'}
                        {activeLogs.length > 0 && (
                            <Badge
                                count={activeLogs.length}
                                size="small"
                                style={{ backgroundColor: '#52c41a' }}
                            />
                        )}
                    </Button>
                    <Button
                        icon={<ClearOutlined />}
                        onClick={clearLogs}
                        disabled={logs.length === 0}
                        danger
                        style={{ marginLeft: 20, marginTop: 20 }}
                    >
                        Clear Logs
                    </Button>
                </Tooltip>
            </div>

            {isModalVisible && (
                <ConsoleContainer
                    ref={consoleRef}
                    style={{ height: 300, borderRadius: 5, border: '2px solid #1677FF' }}
                >
                    {logs.length > 0 ? (
                        logs.map((log) => (
                            <LogLine key={log.id}>
                                <span className="timestamp">
                                    [{dayjs(log.timestamp).format('HH:mm:ss')}]
                                </span>
                                <span className="message">{log.message}</span>
                            </LogLine>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: '#666' }}>
                            <div>No sync activities recorded yet.</div>
                            <div style={{ fontSize: '11px', marginTop: '8px' }}>
                                Console will show logs when sync operations begin...
                            </div>
                        </div>
                    )}
                </ConsoleContainer>
            )}
        </>
    );
};

export default SyncLogger;
