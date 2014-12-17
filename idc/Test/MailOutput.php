<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	</head>
	<body>
		<table>
			<tr>
			<?php
				foreach( $data['columnName'] as $single )
					echo '<td>'.$single.'</td>';
			?>
			</tr>
			<?php
				foreach( $data['columnData'] as $single ){
					echo '<tr>';
					foreach( $single as $single2 )
						echo '<td>'.$single2.'</td>';
					echo '</tr>';
				}
			?>
		</table>
	</body>
</html>