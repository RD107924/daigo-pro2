// 會員管理功能 - 支援跑跑虎會員編號
class MemberManager {
    constructor() {
        this.currentPage = 1;
        this.pageSize = 10;
        this.totalPages = 1;
        this.members = [];
        this.filteredMembers = [];
        this.init();
    }

    init() {
        this.loadMembers();
        this.bindEvents();
        this.updateStats();
    }

    loadMembers() {
        const storedMembers = localStorage.getItem("members");
        if (storedMembers) {
            this.members = JSON.parse(storedMembers);
        } else {
            // 初始化示例會員（使用跑跑虎格式）
            this.members = [
                {
                    id: 1,
                    memberCode: "PPH001",
                    name: "張小明",
                    email: "zhang@example.com",
                    phone: "0912345678",
                    registeredAt: "2024-01-15T10:30:00.000Z",
                    lastLoginAt: "2024-12-20T15:45:00.000Z",
                    status: "active",
                    orderCount: 5,
                    totalSpent: 15000,
                    address: "台北市中正區重慶南路一段122號",
                    birthday: "1990-05-15",
                    idCard: "A123456789",
                    notes: "VIP客戶"
                },
                {
                    id: 2,
                    memberCode: "PPH-2024-002", 
                    name: "李美華",
                    email: "li@example.com",
                    phone: "0987654321",
                    registeredAt: "2024-02-20T14:20:00.000Z",
                    lastLoginAt: "2024-12-19T09:30:00.000Z",
                    status: "active",
                    orderCount: 3,
                    totalSpent: 8500,
                    address: "台中市西區美村路一段30號",
                    birthday: "1985-08-22",
                    notes: "常購買美妝產品"
                },
                {
                    id: 3,
                    memberCode: "runrun123",
                    name: "王大明",
                    email: "wang@example.com",
                    phone: "0911111111",
                    registeredAt: "2024-03-10T09:15:00.000Z",
                    lastLoginAt: "2024-12-18T14:20:00.000Z",
                    status: "active",
                    orderCount: 8,
                    totalSpent: 25000,
                    address: "高雄市前金區中正四路50號",
                    birthday: "1988-12-03",
                    notes: "大客戶"
                }
            ];
            localStorage.setItem("members", JSON.stringify(this.members));
        }
        this.filteredMembers = this.members.slice();
        this.renderMembers();
    }

    bindEvents() {
        const addMemberForm = document.getElementById("addMemberForm");
        if (addMemberForm) {
            addMemberForm.addEventListener("submit", (e) => {
                e.preventDefault();
                this.addMember();
            });
        }

        const memberCodeInput = document.getElementById("newMemberCode");
        if (memberCodeInput) {
            memberCodeInput.addEventListener("input", this.validateMemberCode);
        }
    }

    validateMemberCode(e) {
        const value = e.target.value.trim();
        
        if (value && value.length < 3) {
            e.target.style.borderColor = "#ff4444";
            e.target.title = "會員編號長度至少需要3位字符";
        } else {
            e.target.style.borderColor = "#ddd";
            e.target.title = "";
        }
    }

    renderMembers() {
        const tbody = document.getElementById("membersTable");
        if (!tbody) return;

        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const pageMembers = this.filteredMembers.slice(startIndex, endIndex);

        if (pageMembers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" style="text-align: center;">暫無會員數據</td></tr>';
            return;
        }

        tbody.innerHTML = pageMembers.map(member => `
            <tr>
                <td>${member.memberCode}</td>
                <td>${member.name || member.memberName}</td>
                <td>${member.email || '-'}</td>
                <td>${member.phone || '-'}</td>
                <td>${new Date(member.registeredAt).toLocaleDateString('zh-TW')}</td>
                <td>${member.lastLoginAt ? new Date(member.lastLoginAt).toLocaleDateString('zh-TW') : '從未登入'}</td>
                <td>${member.orderCount || 0}</td>
                <td>NT$ ${(member.totalSpent || 0).toLocaleString()}</td>
                <td><span class="status-${member.status || 'active'}">${this.getStatusText(member.status || 'active')}</span></td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="memberManager.editMember(${member.id})">編輯</button>
                    <button class="btn btn-info btn-sm" onclick="memberManager.viewMemberDetail(${member.id})">詳情</button>
                    <button class="btn btn-warning btn-sm" onclick="memberManager.toggleMemberStatus(${member.id})">
                        ${(member.status || 'active') === 'active' ? '停用' : '啟用'}
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="memberManager.deleteMember(${member.id})">刪除</button>
                </td>
            </tr>
        `).join('');

        this.updatePagination();
    }

    updatePagination() {
        this.totalPages = Math.ceil(this.filteredMembers.length / this.pageSize);
        
        const pageInfo = document.getElementById("pageInfo");
        const prevBtn = document.getElementById("prevBtn");
        const nextBtn = document.getElementById("nextBtn");

        if (pageInfo) {
            pageInfo.textContent = `第 ${this.currentPage} 頁，共 ${this.totalPages} 頁 (${this.filteredMembers.length} 筆)`;
        }

        if (prevBtn) {
            prevBtn.disabled = this.currentPage <= 1;
        }

        if (nextBtn) {
            nextBtn.disabled = this.currentPage >= this.totalPages;
        }
    }

    searchMembers() {
        const searchValue = document.getElementById("memberSearch").value.toLowerCase();
        const statusFilter = document.getElementById("memberStatusFilter").value;

        this.filteredMembers = this.members.filter(member => {
            const matchesSearch = !searchValue || 
                member.memberCode.toLowerCase().includes(searchValue) ||
                (member.name || member.memberName || '').toLowerCase().includes(searchValue) ||
                (member.email && member.email.toLowerCase().includes(searchValue));
            
            const matchesStatus = !statusFilter || (member.status || 'active') === statusFilter;
            
            return matchesSearch && matchesStatus;
        });

        this.currentPage = 1;
        this.renderMembers();
    }

    addMember() {
        const memberCode = document.getElementById("newMemberCode").value.trim();
        const name = document.getElementById("newMemberName").value.trim();
        const email = document.getElementById("newMemberEmail").value.trim();
        const phone = document.getElementById("newMemberPhone").value.trim();
        const idCard = document.getElementById("newMemberIDCard").value.trim();
        const birthday = document.getElementById("newMemberBirthday").value;
        const address = document.getElementById("newMemberAddress").value.trim();
        const notes = document.getElementById("newMemberNotes").value.trim();

        // 驗證會員編號
        if (!memberCode) {
            alert("請輸入會員編號！");
            return;
        }
        
        if (memberCode.length < 3) {
            alert("會員編號長度至少需要3位字符！");
            return;
        }

        // 檢查會員編號是否已存在
        if (this.members.find(m => m.memberCode === memberCode)) {
            alert("此會員編號已存在！");
            return;
        }

        // 驗證姓名
        if (!name) {
            alert("請輸入姓名！");
            return;
        }

        const newMember = {
            id: Date.now(),
            memberCode,
            name,
            email,
            phone,
            idCard,
            birthday,
            address,
            notes,
            registeredAt: new Date().toISOString(),
            status: "active", // 預設為啟用
            orderCount: 0,
            totalSpent: 0
        };

        this.members.push(newMember);
        this.saveMembers();
        this.filteredMembers = this.members.slice();
        this.renderMembers();
        this.updateStats();

        document.getElementById("addMemberForm").reset();
        alert("會員新增成功！預設為啟用狀態");
    }

    editMember(id) {
        const member = this.members.find(m => m.id === id);
        if (!member) return;

        const modal = document.createElement("div");
        modal.className = "modal";
        modal.style.display = "block";
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h2>編輯會員資料</h2>
                <form id="editMemberForm">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div class="form-group">
                            <label>會員編號</label>
                            <input type="text" value="${member.memberCode}" readonly style="background: #f5f5f5;">
                        </div>
                        <div class="form-group">
                            <label>姓名</label>
                            <input type="text" id="editName" value="${member.name || member.memberName || ''}" required>
                        </div>
                        <div class="form-group">
                            <label>電子郵件</label>
                            <input type="email" id="editEmail" value="${member.email || ''}">
                        </div>
                        <div class="form-group">
                            <label>電話</label>
                            <input type="tel" id="editPhone" value="${member.phone || ''}">
                        </div>
                        <div class="form-group">
                            <label>身分證號</label>
                            <input type="text" id="editIDCard" value="${member.idCard || ''}">
                        </div>
                        <div class="form-group">
                            <label>生日</label>
                            <input type="date" id="editBirthday" value="${member.birthday || ''}">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>地址</label>
                        <textarea id="editAddress" rows="2">${member.address || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label>備註</label>
                        <textarea id="editNotes" rows="2">${member.notes || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label>狀態</label>
                        <select id="editStatus">
                            <option value="active" ${(member.status || 'active') === 'active' ? 'selected' : ''}>活躍</option>
                            <option value="inactive" ${member.status === 'inactive' ? 'selected' : ''}>非活躍</option>
                            <option value="suspended" ${member.status === 'suspended' ? 'selected' : ''}>已停用</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">更新資料</button>
                    <button type="button" class="btn btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">取消</button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById("editMemberForm").addEventListener("submit", (e) => {
            e.preventDefault();
            
            member.name = document.getElementById("editName").value;
            member.memberName = member.name; // 同步兩個字段
            member.email = document.getElementById("editEmail").value;
            member.phone = document.getElementById("editPhone").value;
            member.idCard = document.getElementById("editIDCard").value;
            member.birthday = document.getElementById("editBirthday").value;
            member.address = document.getElementById("editAddress").value;
            member.notes = document.getElementById("editNotes").value;
            member.status = document.getElementById("editStatus").value;

            this.saveMembers();
            this.renderMembers();
            modal.remove();
            alert("會員資料已更新！");
        });
    }

    viewMemberDetail(id) {
        const member = this.members.find(m => m.id === id);
        if (!member) return;

        const orders = JSON.parse(localStorage.getItem("orders") || "[]")
            .filter(order => order.memberCode === member.memberCode);

        const modal = document.createElement("div");
        modal.className = "modal";
        modal.style.display = "block";
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <span class="close-modal" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h2>會員詳細資料</h2>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                    <div>
                        <h3>基本資料</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>會員編號：</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${member.memberCode}</td></tr>
                            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>姓名：</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${member.name || member.memberName || '-'}</td></tr>
                            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>電子郵件：</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${member.email || '-'}</td></tr>
                            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>電話：</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${member.phone || '-'}</td></tr>
                            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>生日：</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${member.birthday || '-'}</td></tr>
                            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>註冊時間：</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${new Date(member.registeredAt).toLocaleString('zh-TW')}</td></tr>
                            <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>狀態：</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;"><span class="status-${member.status || 'active'}">${this.getStatusText(member.status || 'active')}</span></td></tr>
                        </table>
                        
                        ${member.address ? `<h4 style="margin-top: 20px;">地址</h4><p>${member.address}</p>` : ''}
                        ${member.notes ? `<h4 style="margin-top: 20px;">備註</h4><p>${member.notes}</p>` : ''}
                    </div>
                    
                    <div>
                        <h3>訂單統計</h3>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                <div style="text-align: center;">
                                    <div style="font-size: 24px; font-weight: bold; color: #EE4D2D;">${orders.length}</div>
                                    <div style="color: #666;">總訂單數</div>
                                </div>
                                <div style="text-align: center;">
                                    <div style="font-size: 24px; font-weight: bold; color: #EE4D2D;">NT$ ${(member.totalSpent || 0).toLocaleString()}</div>
                                    <div style="color: #666;">總消費金額</div>
                                </div>
                            </div>
                        </div>
                        
                        <h4>最近訂單</h4>
                        <div style="max-height: 300px; overflow-y: auto;">
                            ${orders.length > 0 ? 
                                orders.slice(0, 5).map(order => `
                                    <div style="border: 1px solid #eee; padding: 10px; margin-bottom: 10px; border-radius: 5px;">
                                        <div style="font-weight: bold;">${order.orderId || '-'}</div>
                                        <div style="font-size: 12px; color: #666;">
                                            ${new Date(order.createdAt).toLocaleString('zh-TW')} - 
                                            NT$ ${(order.totalAmount || 0).toLocaleString()}
                                        </div>
                                    </div>
                                `).join('') : 
                                '<p style="color: #999;">暫無訂單記錄</p>'
                            }
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    toggleMemberStatus(id) {
        const member = this.members.find(m => m.id === id);
        if (!member) return;

        const currentStatus = member.status || 'active';
        const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
        const action = newStatus === 'active' ? '啟用' : '停用';

        if (confirm(`確定要${action}會員 ${member.name || member.memberName} (${member.memberCode}) 嗎？`)) {
            member.status = newStatus;
            this.saveMembers();
            this.renderMembers();
            this.updateStats();
            alert(`會員已${action}！`);
        }
    }

    deleteMember(id) {
        const member = this.members.find(m => m.id === id);
        if (!member) return;

        if (confirm(`確定要刪除會員 ${member.name || member.memberName} (${member.memberCode}) 嗎？\n此操作無法復原！`)) {
            this.members = this.members.filter(m => m.id !== id);
            this.saveMembers();
            this.filteredMembers = this.members.slice();
            this.renderMembers();
            this.updateStats();
            alert("會員已刪除！");
        }
    }

    getStatusText(status) {
        const statusMap = {
            'active': '活躍',
            'inactive': '非活躍', 
            'suspended': '已停用'
        };
        return statusMap[status] || '活躍';
    }

    updateStats() {
        const total = this.members.length;
        const active = this.members.filter(m => (m.status || 'active') === 'active').length;
        const thisMonth = this.members.filter(m => {
            const regDate = new Date(m.registeredAt);
            const now = new Date();
            return regDate.getMonth() === now.getMonth() && 
                   regDate.getFullYear() === now.getFullYear();
        }).length;
        
        const totalSpent = this.members.reduce((sum, m) => sum + (m.totalSpent || 0), 0);
        const avgSpent = total > 0 ? Math.round(totalSpent / total) : 0;

        const elements = {
            'totalMembersCount': total,
            'activeMembersCount': active,
            'newMembersThisMonth': thisMonth,
            'averageOrderValue': `NT$ ${avgSpent.toLocaleString()}`
        };

        Object.entries(elements).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        });
    }

    saveMembers() {
        localStorage.setItem("members", JSON.stringify(this.members));
    }

    refreshMembers() {
        this.loadMembers();
        this.updateStats();
        alert("會員數據已刷新！");
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderMembers();
        }
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.renderMembers();
        }
    }

    exportAllMembers() {
        this.exportMembers(this.members, "全部會員");
    }

    exportActiveMembers() {
        const activeMembers = this.members.filter(m => (m.status || 'active') === 'active');
        this.exportMembers(activeMembers, "活躍會員");
    }

    exportNewMembers() {
        const thisMonth = new Date();
        const newMembers = this.members.filter(m => {
            const regDate = new Date(m.registeredAt);
            return regDate.getMonth() === thisMonth.getMonth() && 
                   regDate.getFullYear() === thisMonth.getFullYear();
        });
        this.exportMembers(newMembers, "本月新會員");
    }

    exportMembers(members, filename) {
        const format = document.getElementById("exportFormat").value;
        
        if (format === 'csv') {
            this.exportToCSV(members, filename);
        } else if (format === 'json') {
            this.exportToJSON(members, filename);
        } else {
            alert("Excel導出功能開發中...");
        }
    }

    exportToCSV(members, filename) {
        const headers = ['會員編號', '姓名', '電子郵件', '電話', '註冊時間', '狀態', '訂單數', '消費金額'];
        const csvContent = [
            headers.join(','),
            ...members.map(m => [
                m.memberCode,
                m.name || m.memberName || '',
                m.email || '',
                m.phone || '',
                new Date(m.registeredAt).toLocaleDateString('zh-TW'),
                this.getStatusText(m.status || 'active'),
                m.orderCount || 0,
                m.totalSpent || 0
            ].join(','))
        ].join('\n');

        this.downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
    }

    exportToJSON(members, filename) {
        const jsonContent = JSON.stringify(members, null, 2);
        this.downloadFile(jsonContent, `${filename}.json`, 'application/json;charset=utf-8;');
    }

    downloadFile(content, filename, type) {
        const blob = new Blob(['\ufeff' + content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    exportMemberStats() {
        const stats = {
            總會員數: this.members.length,
            活躍會員: this.members.filter(m => (m.status || 'active') === 'active').length,
            非活躍會員: this.members.filter(m => m.status === 'inactive').length,
            已停用會員: this.members.filter(m => m.status === 'suspended').length,
            本月新增: this.members.filter(m => {
                const regDate = new Date(m.registeredAt);
                const now = new Date();
                return regDate.getMonth() === now.getMonth() && 
                       regDate.getFullYear() === now.getFullYear();
            }).length,
            總消費金額: this.members.reduce((sum, m) => sum + (m.totalSpent || 0), 0),
            平均消費: this.members.length > 0 ? 
                Math.round(this.members.reduce((sum, m) => sum + (m.totalSpent || 0), 0) / this.members.length) : 0,
            導出時間: new Date().toLocaleString('zh-TW')
        };

        this.downloadFile(JSON.stringify(stats, null, 2), '會員統計報表.json', 'application/json;charset=utf-8;');
    }
}

// 全域函數
function showMemberTab(tab) {
    document.querySelectorAll('#members-section .tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#members-section .tab-content').forEach(c => c.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tab + '-member-tab').classList.add('active');
    
    if (tab === 'stats' && window.memberManager) {
        window.memberManager.updateStats();
    }
}

function previousPage() {
    if (window.memberManager) {
        window.memberManager.previousPage();
    }
}

function nextPage() {
    if (window.memberManager) {
        window.memberManager.nextPage();
    }
}

function searchMembers() {
    if (window.memberManager) {
        window.memberManager.searchMembers();
    }
}

function refreshMembers() {
    if (window.memberManager) {
        window.memberManager.refreshMembers();
    }
}

function exportAllMembers() {
    if (window.memberManager) {
        window.memberManager.exportAllMembers();
    }
}

function exportActiveMembers() {
    if (window.memberManager) {
        window.memberManager.exportActiveMembers();
    }
}

function exportNewMembers() {
    if (window.memberManager) {
        window.memberManager.exportNewMembers();
    }
}

function exportMemberStats() {
    if (window.memberManager) {
        window.memberManager.exportMemberStats();
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('admin')) {
        setTimeout(function() {
            window.memberManager = new MemberManager();
        }, 1000);
    }
});
