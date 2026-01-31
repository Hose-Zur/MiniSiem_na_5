import pandas as pd
from datetime import datetime, timezone, timedelta
from app.extensions import db
from app.models import Alert, IPRegistry, Host
from app.services.data_manager import DataManager

class LogAnalyzer:
    """
    Serce systemu SIEM. Analizuje pliki logów (Parquet) pod kątem incydentów bezpieczeństwa.
    Realizuje logikę Threat Intelligence oraz Cross-Host Correlation.
    """

    @staticmethod
    def analyze_parquet(filename, host_id):
        """
        Główna funkcja analityczna.
        """
        df = DataManager.load_logs(filename)
        if df.empty or 'alert_type' not in df.columns or 'source_ip' not in df.columns:
            return 0

        attack_pattern = ['FAILED_LOGIN', 'INVALID_USER', 'WIN_FAILED_LOGIN']
        threats = df[df['alert_type'].isin(attack_pattern)]
        if threats.empty:
            return 0

        alerts_created = 0
        utc_now = datetime.now(timezone.utc)

        # Zdefiniowanie okna czasowego dla korelacji zdarzeń (np. ataki z ostatnich 10 minut)
        correlation_window = utc_now - timedelta(minutes=10)

        for index, row in threats.iterrows():
            ip = row['source_ip']
            user = row.get('user', 'unknown')

            # if ip in ['LOCAL', 'LOCAL_CONSOLE', '127.0.0.1', '::1', None, '']:
                # continue

            ip_entry = IPRegistry.query.filter_by(ip_address=ip).first()

            severity = 'WARNING'
            message = f"Wykryto próbę nieudanego logowania z adresu {ip} na użytkownika '{user}'."

            if not ip_entry:
                ip_entry = IPRegistry(ip_address=ip, status='UNKNOWN', last_seen=utc_now)
                db.session.add(ip_entry)
            else:
                ip_entry.last_seen = utc_now
                if ip_entry.status == 'TRUSTED':
                    continue
                elif ip_entry.status == 'BANNED':
                    severity = 'CRITICAL'
                    message = f"KRYTYCZNY: Nieudane logowanie z ZABLOKOWANEGO adresu {ip}!"
                else:
                    other_host_attacks = Alert.query.filter(
                        Alert.source_ip == ip,
                        Alert.host_id != host_id,
                        Alert.timestamp >= correlation_window
                    ).count()

                    if other_host_attacks > 0:
                        # Logika Cross-Host Correlation:
                        # Jeśli to samo IP atakuje różne maszyny w krótkim czasie -> to zorganizowany atak.
                        severity = 'CRITICAL'
                        message = f"KRYTYCZNY: Z adresu {ip} atakowane jest wiele urządzeń!!"

                        ip_entry.status = 'BANNED'
                        db.session.add(ip_entry)

            new_alert = Alert(
                host_id=host_id,
                alert_type=row['alert_type'],
                source_ip=ip,
                severity=severity,
                message=message,
                timestamp=row.get('timestamp', utc_now)
            )
            db.session.add(new_alert)
            alerts_created += 1

        if alerts_created > 0:
            db.session.commit()

        return alerts_created
